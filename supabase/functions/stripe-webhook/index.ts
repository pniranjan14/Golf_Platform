import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY') || ''
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''

const stripe = new Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient(),
})

const supabase = createClient(supabaseUrl, supabaseServiceKey)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Missing stripe-signature' }), { status: 400 })
  }

  const body = await req.text()

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const subId = session.subscription as string
        const stripeSub = await stripe.subscriptions.retrieve(subId)
        
        await supabase.from('subscriptions').upsert({
          user_id: session.metadata.user_id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: subId,
          plan: session.metadata.plan,
          status: 'active',
          current_period_start: new Date(stripeSub.current_period_start * 1000).toISOString(),
          current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as any
        const subId = invoice.subscription as string
        const stripeSub = await stripe.subscriptions.retrieve(subId)

        // 1. Update subscription status
        await supabase.from('subscriptions').update({
          status: 'active',
          current_period_end: new Date(stripeSub.current_period_end * 1000).toISOString(),
        }).eq('stripe_subscription_id', subId)

        // 2. Record Charity Contribution
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subId)
          .single()

        if (sub) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('charity_id, charity_percent')
            .eq('id', sub.user_id)
            .single()

          if (profile?.charity_id) {
            const amount = (invoice.amount_paid / 100) * (profile.charity_percent / 100)
            await supabase.from('charity_contributions').insert({
              user_id: sub.user_id,
              charity_id: profile.charity_id,
              amount: amount,
              percentage_used: profile.charity_percent
            })
          }
        }
        break
      }

      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const sub = event.data.object as any
        await supabase.from('subscriptions').update({
          status: 'lapsed'
        }).eq('stripe_subscription_id', sub.id)
        break
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 200 
    })
  } catch (error) {
    console.error(`Webhook Error: ${error.message}`)
    return new Response(JSON.stringify({ error: error.message }), { 
      headers: { 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})

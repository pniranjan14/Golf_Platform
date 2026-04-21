import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.14.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') || '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
  )

  try {
    const { action, drawType, drawMonth, drawYear } = await req.json()

    if (action === 'simulate' || action === 'publish') {
      // 1. Get all active scores and total pool settings
      const { data: scores } = await supabase.from('scores').select('score, user_id')
      if (!scores || scores.length === 0) throw new Error('No active scores found')

      // 2. Generate Winning Numbers (same logic as before, refactored for reuse)
      let winningNumbers: number[] = []
      // ... generation logic ...
      while (winningNumbers.length < 5) {
        const n = Math.floor(Math.random() * 45) + 1
        if (!winningNumbers.includes(n)) winningNumbers.push(n)
      }

      // 3. Find Winners
      const winners = { match5: [] as string[], match4: [] as string[], match3: [] as string[] }
      const userScores: Record<string, number[]> = {}
      scores.forEach(s => {
        if (!userScores[s.user_id]) userScores[s.user_id] = []
        userScores[s.user_id].push(s.score)
      })
      Object.entries(userScores).forEach(([userId, uScores]) => {
        const matches = uScores.filter(s => winningNumbers.includes(s)).length
        if (matches === 5) winners.match5.push(userId)
        else if (matches === 4) winners.match4.push(userId)
        else if (matches === 3) winners.match3.push(userId)
      })

      if (action === 'simulate') {
        return new Response(JSON.stringify({ winningNumbers, winners }), { headers: corsHeaders })
      }

      // 4. ACTION: PUBLISH (Persist results & calculate prizes)
      const { data: poolInfo } = await supabase.from('draw_prizes_config').select('*').single()
      const totalPool = poolInfo?.current_pool || 0
      const rollover = poolInfo?.jackpot_rollover || 0

      const prizeStructure = {
        match5: (totalPool * 0.40) + rollover,
        match4: totalPool * 0.35,
        match3: totalPool * 0.25
      }

      // Create Draw Entry
      const { data: drawRecord, error: drawError } = await supabase.from('draws').insert({
        draw_month: drawMonth,
        draw_year: drawYear,
        winning_numbers: winningNumbers,
        status: 'published',
        published_at: new Date().toISOString()
      }).select().single()

      if (drawError) throw drawError

      // Record Winners
      const winnerEntries = [
        ...winners.match5.map(uid => ({ draw_id: drawRecord.id, user_id: uid, match_type: 5, prize_amount: prizeStructure.match5 / winners.match5.length })),
        ...winners.match4.map(uid => ({ draw_id: drawRecord.id, user_id: uid, match_type: 4, prize_amount: prizeStructure.match4 / winners.match4.length })),
        ...winners.match3.map(uid => ({ draw_id: drawRecord.id, user_id: uid, match_type: 3, prize_amount: prizeStructure.match3 / winners.match3.length })),
      ]

      if (winnerEntries.length > 0) {
        await supabase.from('draw_winners').insert(winnerEntries)
      }

      // Update Rollover if no Match 5 winner
      if (winners.match5.length === 0) {
        await supabase.from('draw_prizes_config').update({ 
          jackpot_rollover: prizeStructure.match5 
        }).eq('id', poolInfo.id)
      } else {
        await supabase.from('draw_prizes_config').update({ jackpot_rollover: 0 }).eq('id', poolInfo.id)
      }

      return new Response(JSON.stringify({ success: true, drawId: drawRecord.id }), { headers: corsHeaders })
    }

    return new Response(JSON.stringify({ error: 'Unsupported action' }), { status: 400 })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})

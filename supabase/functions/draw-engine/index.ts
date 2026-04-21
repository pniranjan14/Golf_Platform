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
    const { action, month, year } = await req.json()

    if (action === 'simulate' || action === 'publish') {
      // 1. Fetch all scores for the target period
      const { data: scores, error: scoresError } = await supabase
        .from('scores')
        .select('*')
      
      if (scoresError) throw scoresError
      if (!scores || scores.length === 0) throw new Error('No active scores found to process.')

      // 2. Filter scores for the target month/year
      const targetMonthStr = month.toUpperCase()
      const eligibleScores = scores.filter(s => {
        const d = new Date(s.score_date)
        const m = d.toLocaleString('default', { month: 'long' }).toUpperCase()
        const y = d.getFullYear().toString()
        return m === targetMonthStr && y === year.toString()
      })

      if (eligibleScores.length === 0) throw new Error(`No verified scores found for ${targetMonthStr} ${year}.`)

      // 3. Generate Winning Score (The "Target" score for the draw)
      // Logic: Pick a score in the realistic gold range (65-75)
      const winningScore = Math.floor(Math.random() * 11) + 65

      // 4. Identify Winners
      const matchingWinners = eligibleScores.filter(s => s.score === winningScore)
      const winnersCount = matchingWinners.length
      const uniqueParticipants = new Set(eligibleScores.map(s => s.user_id)).size

      // 5. Calculate Prize Pool (Simulated for this tool, usually would come from sub totals)
      const estimatedPrizePool = 42500.00
      
      const result = {
        month: targetMonthStr,
        year,
        winningScore,
        winnersCount,
        participantsCount: uniqueParticipants,
        totalPrizePool: estimatedPrizePool,
        winners: matchingWinners.map(w => ({ user_id: w.user_id, score: w.score }))
      }

      if (action === 'simulate') {
        return new Response(JSON.stringify(result), { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
          status: 200 
        })
      }

      // 6. Action: PUBLISH
      const { data: drawRecord, error: drawError } = await supabase.from('draws').insert({
        month: targetMonthStr,
        draw_date: new Date().toISOString(),
        winning_score: winningScore,
        winners_count: winnersCount,
        total_prize_pool: estimatedPrizePool,
        participants_count: uniqueParticipants,
        status: 'published'
      }).select().single()

      if (drawError) throw drawError

      return new Response(JSON.stringify({ success: true, drawId: drawRecord.id, result }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 200 
      })
    }

    return new Response(JSON.stringify({ error: 'Unsupported action request' }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
      status: 400 
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get current count
    const { data: currentData, error: fetchError } = await supabase
      .from('visitors')
      .select('count')
      .eq('id', 1)
      .single();

    if (fetchError) {
      console.error('Error fetching visitor count:', fetchError);
      throw fetchError;
    }

    // Increment and update
    const { data, error } = await supabase
      .from('visitors')
      .update({ 
        count: currentData.count + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', 1)
      .select()
      .single();

    if (error) {
      console.error('Error incrementing visitor count:', error);
      throw error;
    }

    console.log('Visitor count incremented:', data.count);

    return new Response(
      JSON.stringify({ count: data.count }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in track-visitor function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

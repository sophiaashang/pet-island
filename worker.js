export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Pet-Token',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    const url = new URL(request.url)
    const path = url.pathname.replace(/^\//, '')

    // GET /yuanyuan or /xinbei - return the profile
    if (request.method === 'GET') {
      const data = await env.DATA.get(path)
      return new Response(data || '{}', {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // POST /yuanyuan or /xinbei - save the profile
    if (request.method === 'POST') {
      const body = await request.text()
      await env.DATA.put(path, body)
      return new Response('OK', { headers: corsHeaders })
    }

    return new Response('Not Found', { status: 404 })
  }
}

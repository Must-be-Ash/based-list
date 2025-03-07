import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - in a real implementation, this would be fetched from a database or indexer
const mockBaseNames = [
  'jesse.base.eth',
  'mustbeash.base.eth',
  'vitalik.base.eth',
  'ashleigh.base.eth',
  'ashton.base.eth',
  'ashley.base.eth',
  'basher.base.eth',
  'dashboard.base.eth',
  'stash.base.eth',
  'flash.base.eth',
  'crash.base.eth',
  'bash.base.eth',
  'cashflow.base.eth',
  'smash.base.eth',
  'splash.base.eth',
  'hash.base.eth',
  'asher.base.eth',
  'ashlynn.base.eth',
  'ashford.base.eth',
  'ashby.base.eth',
  'ashland.base.eth',
  'ashlee.base.eth',
  'ashanti.base.eth',
  'ashwin.base.eth',
  'ashworth.base.eth',
  'asheville.base.eth',
  'ashram.base.eth',
  'ashoka.base.eth',
  'ashurbanipal.base.eth',
  'ashkenazi.base.eth',
];

// Track API calls for debugging
const apiCallsLog: { [key: string]: number } = {};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query')?.toLowerCase().trim();
    
    if (!query) {
      return NextResponse.json(
        { 
          message: 'Search query is required',
          error: 'MISSING_QUERY',
          details: 'Please provide a search query parameter'
        },
        { status: 400 }
      );
    }
    
    // Log API call for debugging
    apiCallsLog[query] = (apiCallsLog[query] || 0) + 1;
    console.log(`ENS search request for "${query}" (call #${apiCallsLog[query]})`);
    
    // In a real implementation, this would query a database or indexer
    // For now, we'll use the mock data and filter it
    const results = mockBaseNames
      .filter(name => name.toLowerCase().includes(query))
      .map(name => ({
        name,
        // Remove the .base.eth suffix for display
        displayName: name.replace('.base.eth', ''),
        // In a real implementation, we would fetch these from the ENS contracts
        // For now, we'll just provide placeholder values
        avatar: null,
        address: null
      }));
    
    console.log(`Found ${results.length} results for query: ${query}`);
    
    return NextResponse.json({
      query,
      results,
      count: results.length
    });
    
  } catch (error) {
    console.error('Error processing ENS search:', error);
    return NextResponse.json(
      { 
        message: `Error processing ENS search: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error: 'PROCESSING_ERROR',
        details: error instanceof Error ? error.stack : 'No stack trace available'
      },
      { status: 500 }
    );
  }
} 
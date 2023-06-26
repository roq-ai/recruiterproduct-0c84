const mapping: Record<string, string> = {
  candidates: 'candidate',
  pipelines: 'pipeline',
  'pipeline-candidates': 'pipeline_candidate',
  recruiters: 'recruiter',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}

// Client-side URL Router & Deep-Linking Utility for EEC Virtual Lab
// Seamlessly syncs window.location.hash with the Zustand lab store

export function parseHash(hash = window.location.hash) {
  const clean = hash.replace(/^#\/?/, '').trim();
  if (!clean || clean === 'index' || clean === 'home') {
    return { view: 'index_table', topicId: null };
  }
  if (clean === 'calculator' || clean === 'solver' || clean === 'math') {
    return { view: 'calculator', topicId: null };
  }
  if (clean === 'troubleshooting' || clean === 'fault' || clean === 'game') {
    return { view: 'troubleshooting', topicId: null };
  }
  if (clean === 'tutor' || clean === 'ai_tutor') {
    return { view: 'tutor', topicId: null };
  }
  if (clean === 'quizzes' || clean === 'quiz') {
    return { view: 'quizzes', topicId: null };
  }
  if (clean.startsWith('explain/')) {
    const topicId = clean.replace('explain/', '');
    return { view: 'explanation', topicId };
  }
  if (clean.startsWith('labs/')) {
    const topicId = clean.replace('labs/', '');
    return { view: 'explorer', topicId };
  }
  if (clean === 'labs' || clean === 'lab' || clean === 'sandbox') {
    return { view: 'explorer', topicId: null };
  }
  return { view: 'index_table', topicId: null };
}

export function formatHash(view, topicId) {
  switch (view) {
    case 'index_table':
      return '#/index';
    case 'calculator':
      return '#/calculator';
    case 'troubleshooting':
      return '#/troubleshooting';
    case 'tutor':
      return '#/tutor';
    case 'quizzes':
      return '#/quizzes';
    case 'explanation':
      return topicId !== undefined && topicId !== null ? `#/explain/${topicId}` : '#/index';
    case 'explorer':
    case 'sandbox':
      return topicId !== undefined && topicId !== null ? `#/labs/${topicId}` : '#/labs';
    default:
      return '#/index';
  }
}

export function syncHashWithState(view, topicId) {
  const targetHash = formatHash(view, topicId);
  if (window.location.hash !== targetHash) {
    window.history.replaceState(null, '', targetHash);
  }
}

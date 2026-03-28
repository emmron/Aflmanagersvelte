import type { View } from './types/engine';

export let current_view: View = $state('code');
export let is_saving = $state(false);

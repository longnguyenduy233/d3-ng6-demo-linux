export * from './node-visual/node-visual.component';
export * from './link-visual/link-visual.component';
export * from './creation-entity-visual/creation-entity-visual.component';
export * from './menu-visual/menu-visual.component';

import { NodeVisualComponent } from './node-visual/node-visual.component';
import { LinkVisualComponent } from './link-visual/link-visual.component';

export const SHARED_VISUALS = [
  NodeVisualComponent,
  LinkVisualComponent
];

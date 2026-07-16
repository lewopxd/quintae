// ============================================================
// SidebarController — Tree events, visibility/lock/color
// Adapted for new mockup CAD tree design with Phosphor Icons
// ============================================================

import { EventBus } from '../core/EventBus.js';
import { State } from '../core/State.js';
import { Registry } from '../core/Registry.js';
import { History } from '../core/History.js';
import { applyLayerVisibility, updateBrightness } from '../engine/SceneManager.js';
import { syncSelectionEdges } from '../engine/SelectionRenderer.js';
import { createIcons, $ } from '../utils/dom.js';
import { switchCategory } from './TreeBuilder.js';

/**
 * Initialize sidebar: toggle, tree click/dblclick, visibility/lock/color
 */
export function initSidebar() {
    const sidebarEl = $('sidebar');

    // Z-index on click
    sidebarEl.addEventListener('mousedown', () => { sidebarEl.style.zIndex = State.bumpZ(); });
    $('properties-panel').addEventListener('mousedown', () => { $('properties-panel').style.zIndex = State.bumpZ(); });

    // Explorer toggle
    const toggleExplorer = function () {
        const willOpen = !sidebarEl.classList.contains('open');
        sidebarEl.classList.toggle('open');
        
        const topBtn = $('btn-top-explorer');
        if (topBtn) topBtn.classList.toggle('active', willOpen);
        
        const railBtn = $('nav-explorer');
        if (railBtn) railBtn.classList.toggle('active', willOpen);
        
        if (willOpen) EventBus.emit('ui:closeOthers', 'sidebar');
    };
    
    // Exponer para el HTML
    window._toggleExplorer = toggleExplorer;

    EventBus.on('ui:closeOthers', (source) => {
        if (source !== 'sidebar') {
            sidebarEl.classList.remove('open');
            const topBtn = $('btn-top-explorer');
            const railBtn = $('nav-explorer');
            if (topBtn) topBtn.classList.remove('active');
            if (railBtn) railBtn.classList.remove('active');
        }
    });

    // Tree click (select) — works on .tree-node elements
    const treeContainer = $('tree-container');
    if (treeContainer) {
        treeContainer.addEventListener('click', e => {
            // Don't interfere with controls or chevrons
            if (e.target.closest('.tree-node-controls')) return;
            if (e.target.closest('.chevron')) return;

            const nodeRow = e.target.closest('.tree-node');
            if (!nodeRow) {
                EventBus.emit('selection:clear');
                return;
            }

            // Highlight selected
            document.querySelectorAll('.tree-node.selected').forEach(n => n.classList.remove('selected'));
            nodeRow.classList.add('selected');

            let mesh = null;
            if (nodeRow.dataset.type === 'elemento' && nodeRow.dataset.id) {
                mesh = Registry.findStructureById(nodeRow.dataset.id);
            }
            EventBus.emit('selection:select', { mesh, li: nodeRow, showProps: false });
        });

        // Tree dblclick (select + show props)
        treeContainer.addEventListener('dblclick', e => {
            if (e.target.closest('.tree-node-controls')) return;
            const nodeRow = e.target.closest('.tree-node');
            if (!nodeRow) return;

            let mesh = null;
            if (nodeRow.dataset.type === 'elemento' && nodeRow.dataset.id) {
                mesh = Registry.findStructureById(nodeRow.dataset.id);
            }
            EventBus.emit('selection:select', { mesh, li: nodeRow, showProps: true });
        });
    }

    // Visibility toggle
    sidebarEl.addEventListener('click', e => {
        const btn = e.target.closest('.visibility-btn');
        const lockBtn = e.target.closest('.lock-btn');

        if (btn) {
            e.stopPropagation();
            const targetId = btn.dataset.target;
            if (!targetId) return;
            const isHidden = btn.classList.contains('hidden-layer');
            const newState = isHidden; // if hidden, newState = true (make visible)

            const getLogicalGroup = (s) => {
                if (s.userData.isPersona) {
                    return s.userData.group || 'personas';
                }
                if (s.userData.isFolder) {
                    return s.userData.group || 'escenografia';
                }
                if (!s.userData.isFolder && !s.userData.isPersona && 
                    s.userData.id !== 'piso' && 
                    s.userData.id !== 'contenedor-escenico' &&
                    s.userData.group !== 'paredes' && 
                    s.userData.group !== 'barras') {
                    
                    const group = s.userData.group;
                    if (group === 'utileria' || group === 'tecnicos') {
                        return group;
                    }
                    if (group && Registry.getStructures().some(x => x.userData.isFolder && x.userData.id === group)) {
                        return group;
                    }
                    return 'escenografia';
                }
                return s.userData.group;
            };

            const getLogicalGroupForWire = (w) => {
                if (w.userData.isPersonaWire) {
                    return w.userData.group || 'personas';
                }
                const group = w.userData.group;
                if (group === 'utileria' || group === 'tecnicos') {
                    return group;
                }
                if (group && Registry.getStructures().some(x => x.userData.isFolder && x.userData.id === group)) {
                    return group;
                }
                return 'escenografia';
            };

            const setVisibilityRecursively = (id, state) => {
                Registry.getStructures().forEach(s => {
                    if (s.userData.id === id) {
                        s.userData.layerVisible = state;
                    }
                    if (getLogicalGroup(s) === id) {
                        s.userData.layerVisible = state;
                        if (s.userData.isFolder) {
                            setVisibilityRecursively(s.userData.id, state);
                        }
                    }
                });
                Registry.getWires().forEach(w => {
                    if (w.userData.id === id) {
                        w.userData.layerVisible = state;
                    }
                    if (getLogicalGroupForWire(w) === id) {
                        w.userData.layerVisible = state;
                    }
                });
            };

            setVisibilityRecursively(targetId, newState);
            applyLayerVisibility(State.get('is3DMode'), State.get('isWireframe'));
            History.save();
            switchCategory(State.get('activeCategory'));
        }

        if (lockBtn) {
            e.stopPropagation();
            const targetId = lockBtn.dataset.target;
            if (!targetId) return;
            const isLocked = lockBtn.classList.contains('is-locked');
            const newState = !isLocked;

            const setLockRecursively = (id, state) => {
                Registry.getStructures().forEach(s => {
                    if (s.userData.id === id) {
                        s.userData.locked = state;
                    }
                    if (getLogicalGroup(s) === id) {
                        s.userData.locked = state;
                        if (s.userData.isFolder) {
                            setLockRecursively(s.userData.id, state);
                        }
                    }
                });
            };

            setLockRecursively(targetId, newState);

            const selectedMesh = State.get('selectedMesh');
            if (selectedMesh && selectedMesh.userData.locked) {
                EventBus.emit('selection:clear');
            } else {
                EventBus.emit('properties:refresh');
            }
            History.save();
            switchCategory(State.get('activeCategory'));
        }
    });

    // Color picker real-time update (for legacy .layer-picker inputs if any remain)
    const handleColorUpdate = (e) => {
        if (!e.target.classList.contains('layer-picker')) return;
        const { target, isGroup } = e.target.dataset;
        const val = e.target.value;

        Registry.getWires().forEach(w => {
            if ((isGroup === 'true' && w.userData.group === target) || w.userData.id === target)
                w.userData.baseColor.set(val);
        });

        if (isGroup === 'true') {
            document.querySelectorAll(`.layer-picker[data-parent="${target}"]`).forEach(c => c.value = val);
        }

        const selectedMesh = State.get('selectedMesh');
        syncSelectionEdges(selectedMesh);
        if (selectedMesh && (selectedMesh.userData.id === target || selectedMesh.userData.group === target)) {
            EventBus.emit('properties:refresh');
        }

        const slider = $('brightness-slider');
        updateBrightness(slider ? parseFloat(slider.value) : 1);
    };

    sidebarEl.addEventListener('input', handleColorUpdate);
    
    sidebarEl.addEventListener('change', e => {
        if (!e.target.classList.contains('layer-picker')) return;
        handleColorUpdate(e);
        History.save();
    });
}

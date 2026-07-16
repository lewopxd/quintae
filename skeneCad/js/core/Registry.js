// ============================================================
// Registry — Registro central de meshes, wires, dimensions
// Reemplaza los arrays globales sueltos (structures, wires, dimensions)
// ============================================================

const structures = [];
const wires = [];
const dimensions = [];

export const Registry = {
    // ---- Structures (solid meshes) ----
    addStructure(mesh) {
        structures.push(mesh);
    },

    removeStructure(mesh) {
        const idx = structures.indexOf(mesh);
        if (idx !== -1) structures.splice(idx, 1);
    },

    getStructures() {
        return structures;
    },

    findStructureById(id) {
        return structures.find(m => m.userData.id === id);
    },

    // ---- Wires (wireframe edges) ----
    addWire(wire) {
        wires.push(wire);
    },

    removeWire(wire) {
        const idx = wires.indexOf(wire);
        if (idx !== -1) wires.splice(idx, 1);
    },

    getWires() {
        return wires;
    },

    findWireById(id) {
        return wires.find(w => w.userData.id === id);
    },

    // ---- Dimensions (CAD annotations) ----
    addDimension(dim) {
        dimensions.push(dim);
    },

    removeDimension(dim) {
        const idx = dimensions.indexOf(dim);
        if (idx !== -1) dimensions.splice(idx, 1);
    },

    getDimensions() {
        return dimensions;
    },

    // ---- Bulk operations ----
    /**
     * Remove structure and its associated wire by id
     */
    removeById(id) {
        const sIdx = structures.findIndex(m => m.userData.id === id);
        if (sIdx !== -1) structures.splice(sIdx, 1);
        const wIdx = wires.findIndex(w => w.userData.id === id);
        if (wIdx !== -1) wires.splice(wIdx, 1);
    },

    /**
     * Clear all registries (for loading new theatre)
     */
    clear() {
        structures.length = 0;
        wires.length = 0;
        dimensions.length = 0;
    },

    /**
     * Get structure at index (for History compat)
     */
    getStructureAt(index) {
        return structures[index];
    },

    getWireAt(index) {
        return wires[index];
    },

    structureCount() {
        return structures.length;
    },

    getGroupDescendantsCount(groupId) {
        let count = 0;
        const countChildren = (id) => {
            const children = structures.filter(s => s.userData && s.userData.group === id);
            children.forEach(c => {
                if (c.userData.isFolder) {
                    countChildren(c.userData.id);
                } else {
                    count++;
                }
            });
        };
        countChildren(groupId);
        return count;
    },

    getGroupDescendantTreeHtml(groupId) {
        const buildTreeList = (id, indent = 0) => {
            let html = '';
            const children = structures.filter(s => s.userData && s.userData.group === id);
            children.forEach(c => {
                const spaces = '&nbsp;'.repeat(indent * 4);
                const icon = c.userData.isFolder ? 'ph-folder' : 'ph-cube';
                const name = c.userData.name || (c.userData.isPersona ? 'Persona' : 'Elemento');
                html += `<div style="font-family: 'Inter', sans-serif; font-size: 11px; margin: 4px 0; color: rgba(255,255,255,0.85); display: flex; align-items: center; gap: 6px;">
                    <span>${spaces}</span>
                    <i class="ph ${icon}" style="color: #5b9bff; font-size: 13px;"></i>
                    <strong>${name}</strong>
                </div>`;
                if (c.userData.isFolder) {
                    html += buildTreeList(c.userData.id, indent + 1);
                }
            });
            return html;
        };
        return buildTreeList(groupId, 0);
    }
};

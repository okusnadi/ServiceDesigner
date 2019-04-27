import { Singletone } from '../utils/singletone';
import { LayoutManager } from '../manager/layout.manager';
import Utils from '../utils/utils';
import { FolderManager } from '../manager/folder.manager';
import { ElementManager } from '../manager/element.manager';
import { ColorManager } from '../manager/color.manager';
import { AssetManager } from '../manager/asset.manager';
import { CssManager } from '../manager/css.manager';

export class HistoryService extends Singletone<HistoryService> {

    static ACTION_LAYOUT_CREATE = 'layout_create';
    static ACTION_LAYOUT_UPDATE = 'layout_update';
    static ACTION_LAYOUT_DELETE = 'layout_delete';
    static ACTION_LAYOUT_STATE = 'layout_state';

    static ACTION_FOLDER_CREATE = 'folder_create';
    static ACTION_FOLDER_DELETE = 'folder_delete';

    static ACTION_ELEMENT_CREATE = 'element_create';
    static ACTION_ELEMENT_UPDATE = 'element_update';
    static ACTION_ELEMENT_DELETE = 'element_delete';

    static ACTION_COLOR_CREATE = 'color_create';
    static ACTION_COLOR_UPDATE = 'color_update';
    static ACTION_COLOR_DELETE = 'color_delete';

    static ACTION_ASSET_CREATE = 'asset_create';
    static ACTION_ASSET_UPDATE = 'asset_update';
    static ACTION_ASSET_DELETE = 'asset_delete';

    static ACTION_CSS_CREATE = 'css_create';
    static ACTION_CSS_UPDATE = 'css_update';
    static ACTION_CSS_DELETE = 'css_delete';

    stack:any = [];
    undoStack:any = [];
    
    state = 'wait';

    push(action:any) {
        document.getElementsByTagName('title')[0].innerText = '*Service Designer';
        if (this.state === 'wait') {
            this.stack.push(action);
            this.undoStack = [];
        } else if (this.state === 'undo') {
            this.state = 'wait';
        } else if (this.state === 'redo') {
            this.stack.push(action);
            this.state = 'wait';
        }
    }

    reset() {
        this.state = 'wait';
    }

    flush() {
        this.reset();
        this.stack = [];
        this.undoStack = [];
    }

    undo() {
        if (this.stack.length > 0) {
            this.state = 'undo';
            const history:any = this.stack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.deleteLayout(history.childId);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.before);
            else if (history.action === HistoryService.ACTION_LAYOUT_DELETE) this.createLayout(history.parentId, history.child); 
            else if (history.action === HistoryService.ACTION_LAYOUT_STATE) this.updateLayoutState(history.before);
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.createFolder(history.parentId, history.child, history.layoutData);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.before);
            else if (history.action === HistoryService.ACTION_COLOR_CREATE) this.deleteColor(history.name);
            else if (history.action === HistoryService.ACTION_COLOR_UPDATE) this.updateColor(history.before.name, history.before.color);
            else if (history.action === HistoryService.ACTION_COLOR_DELETE) this.createColor(history.name, history.color);
            else if (history.action === HistoryService.ACTION_ASSET_CREATE) this.deleteAsset(history.name);
            else if (history.action === HistoryService.ACTION_ASSET_UPDATE) this.updateAsset(history.before.name, history.before.value);
            else if (history.action === HistoryService.ACTION_ASSET_DELETE) this.createAsset(history.name, history.value);
            else if (history.action === HistoryService.ACTION_CSS_CREATE) this.deleteCss(history.name);
            else if (history.action === HistoryService.ACTION_CSS_UPDATE) this.updateCss(history.before.name, history.before.value);
            else if (history.action === HistoryService.ACTION_CSS_DELETE) this.createCss(history.name, history.value);
            this.undoStack.push(history);
        }
    }

    redo() {
        if (this.undoStack.length > 0) {
            this.state = 'redo';
            const history = this.undoStack.pop();
            if (history.action === HistoryService.ACTION_LAYOUT_CREATE) this.createLayout(history.parentId, history.child);
            else if (history.action === HistoryService.ACTION_LAYOUT_UPDATE) this.updateLayout(history.after);
            else if (history.action === HistoryService.ACTION_LAYOUT_DELETE) this.deleteLayout(history.child.id);
            else if (history.action === HistoryService.ACTION_LAYOUT_STATE) this.updateLayoutState(history.after);
            else if (history.action === HistoryService.ACTION_FOLDER_CREATE) this.createFolder(history.parentId, history.child, history.layoutData);
            else if (history.action === HistoryService.ACTION_FOLDER_DELETE) this.deleteFolder(history.child.id);
            else if (history.action === HistoryService.ACTION_ELEMENT_CREATE) this.createElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_DELETE) this.deleteElement(history.elem);
            else if (history.action === HistoryService.ACTION_ELEMENT_UPDATE) this.updateElement(history.after);
            else if (history.action === HistoryService.ACTION_COLOR_CREATE) this.createColor(history.name, history.color);
            else if (history.action === HistoryService.ACTION_COLOR_UPDATE) this.updateColor(history.after.name, history.after.color);
            else if (history.action === HistoryService.ACTION_COLOR_DELETE) this.deleteColor(history.name);
            else if (history.action === HistoryService.ACTION_ASSET_CREATE) this.createAsset(history.name, history.value);
            else if (history.action === HistoryService.ACTION_ASSET_UPDATE) this.updateAsset(history.after.name, history.after.value);
            else if (history.action === HistoryService.ACTION_ASSET_DELETE) this.deleteAsset(history.name);
            else if (history.action === HistoryService.ACTION_CSS_CREATE) this.createCss(history.name, history.value);
            else if (history.action === HistoryService.ACTION_CSS_UPDATE) this.updateCss(history.after.name, history.after.value);
            else if (history.action === HistoryService.ACTION_CSS_DELETE) this.deleteCss(history.name);
        }
    }

    createLayout(parentId:any, elem:any) {
        const manager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        manager.selected = parentId;
        manager.create(Utils.deepcopy(elem));
    }

    updateLayout(after:any) {
        const manager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        manager.update(Utils.deepcopy(after));
    }

    deleteLayout(id:any) {
        const manager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        manager.selected = id;
        manager.delete();
    }

    updateLayoutState(state:any) {
        const manager:LayoutManager = LayoutManager.getInstance(LayoutManager);
        manager.setState(state);
    }

    createFolder(parentId:any, elem:any, layoutData:any) {
        const manager:LayoutManager = FolderManager.getInstance(FolderManager);
        manager.selected = parentId;
        // manager.create(elem, FolderManager.TYPE_OBJ, layoutData);
        manager.create(elem);
    }

    deleteFolder(id:any) {
        const manager:FolderManager = FolderManager.getInstance(FolderManager);
        manager.selected = id;
        manager.delete();
    }

    createElement(elem:any) {
        const manager:ElementManager = ElementManager.getInstance(ElementManager);
        manager.create(elem);
    }

    deleteElement(elem:any) {
        const manager:ElementManager = ElementManager.getInstance(ElementManager);
        manager.delete(elem.id);
    }

    updateElement(elem:any) {
        const manager:ElementManager = ElementManager.getInstance(ElementManager);
        manager.update(elem);
    }

    createColor(name:any, color:any) {
        const manager:ColorManager = ColorManager.getInstance(ColorManager);
        manager.create(name, color);
    }

    updateColor(name:any, color:any) {
        const manager:ColorManager = ColorManager.getInstance(ColorManager);
        manager.create(name, color);
    }

    deleteColor(name:any) {
        const manager:ColorManager = ColorManager.getInstance(ColorManager);
        manager.delete(name);
    }

    createAsset(name:any, color:any) {
        const manager:AssetManager = AssetManager.getInstance(AssetManager);
        manager.create(name, color);
    }

    updateAsset(name:any, color:any) {
        const manager:AssetManager = AssetManager.getInstance(AssetManager);
        manager.update(name, color);
    }

    deleteAsset(name:any) {
        const manager:AssetManager = AssetManager.getInstance(AssetManager);
        manager.delete(name);
    }

    createCss(name:any, value:any) {
        const manager:CssManager = CssManager.getInstance(CssManager);
        manager.create(name, value);
    }

    updateCss(name:any, value:any) {
        const manager:CssManager = CssManager.getInstance(CssManager);
        manager.update(name, value);
    }

    deleteCss(name:any) {
        const manager:CssManager = CssManager.getInstance(CssManager);
        manager.delete(name);
    }
}
const InputController = class {
    enabled = true
    focused = true;
    static ACTION_ACTIVATED = 'input-controller:action-activated'
    static ACTION_DEACTIVATED = 'input-controller:action-deactivated'
    

    constructor (target, actionsToBind) {
        this.target = target
        this.actionsToBind = actionsToBind
        this.enabledAction = new Set() //Множество включенных активностей, включена генерация событий для них
        this.actions = {}
        this.pressedKeys = new Set() //Множество зажатых клавиш в данный момент
        this.targets = ['.target__square', '.target__triangle']
        this.activeActions = {}

        this.bindActions(actionsToBind)
        this.actionActivate = this.actionActivate.bind(this)
        this.actionDeactivate = this.actionDeactivate.bind(this)
        document.addEventListener('keydown', this.actionActivate)
        document.addEventListener('keyup', this.actionDeactivate)
    }

    actionActivate (e) {
        this.pressedKeys.add(e.keyCode)
        if(!this.enabled) return;
        for(let action of this.enabledAction) {
            this.activeActions[action] && this.activeActions[action].size === 0 ? delete this.activeActions[action] : null
            if (!this.isActionActive(action)) {
                this.activeActions.hasOwnProperty(action) ? null : this.activeActions[action] = new Set()
                for (let i of this.pressedKeys) {
                    if(action && this.actions[action].key.includes(i)) {
                        this.activeActions[action].add(i)
                        try {
                                this.enabled ? document.querySelector('.' + this.target).dispatchEvent(new CustomEvent(InputController.ACTION_ACTIVATED, {detail: {action : action}})) : null
                                console.log(this.activeActions)
                        } catch {
                                console.log('Нет привязанной цели')
                        }
                    }
                }
            } else {
                for (let i of this.pressedKeys) {
                    if(action && this.actions[action].key.includes(i)) {
                        this.activeActions[action].add(i)
                    }
                }
            }

        } 
    }

    actionDeactivate (e) {
        this.pressedKeys.delete(e.keyCode)
        this.pressedKeys.size === 0 ? this.activeActions = {} : null
        
        for(let action in this.activeActions) {
            if (this.actions[action].key.includes(e.keyCode)) {
                console.log(action)
                this.activeActions[action].delete(e.keyCode)
                this.activeActions[action].size === 0 ? delete this.activeActions[action] : null
                try {
                    this.enabled ? document.querySelector('.' + this.target).dispatchEvent(new CustomEvent(InputController.ACTION_DEACTIVATED, {detail: {action : action}})) : null
                } catch {
                    console.log('Нет привязанной цели')
                }   
            }
        }
    }

    bindActions (actionsToBind) {
        for (let [actionKey, actionValue] of Object.entries(actionsToBind)) {
            actionValue.key.forEach((key => {
                if (!this.actions[actionKey]) {
                    this.actions[actionKey] = actionValue
                } else if (!this.actions[actionKey].key.includes(key)){
                     this.actions[actionKey].key.push(key)
                }
            })) 
        }
    }

    enableAction(actionName) {
        if (this.actions.hasOwnProperty(actionName)) {
            this.enabledAction.add(actionName)
            console.log(actionName + '----' + InputController.ACTION_ACTIVATED)
            actionName ? console.log('Сейчас включены:', ...this.enabledAction) : 'Сейчас нет включенных активностей'
        }
    }

    disableAction(actionName) {
        actionName ? this.enabledAction.delete(actionName) : ''
        console.log(actionName + '----' + InputController.ACTION_DEACTIVATED)
        actionName ? console.log('Сейчас включены:', ...this.enabledAction) : 'Сейчас нет включенных активностей'
    }

    attach(target, dontEnable) {
        this.target = target
        !dontEnable ? this.enabled = false : this.enabled = true
        console.log('Текущая цель: ' + this.target)
    }

    detach() {
        this.target = null
    }

    isActionActive (action) {
        return this.activeActions.hasOwnProperty(action)
    }

    isKeyPressed(keyCode) {
        return this.pressedKeys.has(keyCode) ? true : false
    }
}


const controllerFrst = new InputController('target__square', {'вперед' : {key: [38, 87]}})
window.controller = controllerFrst;
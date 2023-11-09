//Очистка инпутов
function clearInputs () {
    document.querySelectorAll('input').forEach((item) => {
        item.value = ''
    })
}


//Подготовка к созданию активности
function prepareToBind (actionName, keys) {
    let keyObject = {key : keys.split(' ').map(Number)}
    window.controller.bindActions({[actionName] : keyObject})
}


//Тестирование bindActions
document.querySelector('.bindActionsBtn').addEventListener('click', function () {
    const keys = document.querySelector('.bind__keysList').value
    const action = document.querySelector('.bind__actionName').value
    prepareToBind(action, keys)
    clearInputs()
}.bind(window.controller))


//Тестирование enableAction
document.querySelector('.enableAction__btn').addEventListener('click', function () {
    this.enableAction(document.querySelector('.enableAction__input').value)
    clearInputs()
}.bind(window.controller))


//Тестирование disableAction
document.querySelector('.disableAction__btn').addEventListener('click', function () {
    this.disableAction(document.querySelector('.disableAction__input').value)
    clearInputs()
}.bind(window.controller))


//Teстирование attach
let square = document.querySelector('.target__square')
let triangle = document.querySelector('.target__triangle')
let targets = [square, triangle]
targets.forEach((i) => {
    i.addEventListener('click', function (e) {
        let dontEnable = !document.querySelector('.attach__checkbox').checked
        let target = e.target.className
        this.attach(target, dontEnable)
    }.bind(window.controller))
})


//Тестирование detach
document.querySelector('.detach').addEventListener('click', function () {
    this.detach()
    console.log('Текущая цель: ' + this.target)
}.bind(window.controller))


//Тестирование isKeyPressed
document.querySelector('.isKeyPressed__btn').addEventListener('click', function (e) {
    this.isKeyPressed(Number(document.querySelector('.isKeyPressed__input').value))
}.bind(window.controller))


//Инструкция реакций на активности
const randomColor = () => Math.floor(Math.random()*16777215).toString(16)
window.controller.targets.forEach((target) => {
    const location = {
        Y : 0,
        X : 0
    }
    
    document.querySelector(target).addEventListener(InputController.ACTION_ACTIVATED, function (e) {
        requestAnimationFrame(function() {checkAnimation(e.detail.action, target)})
        console.log('ACTION_ACTIVATED')
    })
    
    document.querySelector(target).addEventListener(InputController.ACTION_DEACTIVATED, function (e) {
        console.log('ACTION_DEACTIVATED')
    })

    function checkAnimation (action, target) {
        if(action === 'прыжок') {
            document.querySelector(target).style.backgroundColor = '#' + randomColor()
        } else if(action === 'вперед') {
            location.Y -= 1
            if(window.controller.isActionActive(action)) {
                requestAnimationFrame(function() {
                    checkAnimation(action, target)
                })  
            }
        } else if(action === 'назад') {
            location.Y += 1
            if(window.controller.isActionActive(action)) {
                requestAnimationFrame(function() {
                    checkAnimation(action, target)
                })  
            }
        } else if(action === 'вправо') {
            location.X += 1
            if(window.controller.isActionActive(action)) {
                requestAnimationFrame(function() {
                    checkAnimation(action, target)
                })  
            }
        } else if (action === 'влево') {
            location.X -= 1
            if(window.controller.isActionActive(action)) {
                requestAnimationFrame(function() {
                    checkAnimation(action, target)
                })  
            }
        } 
        document.querySelector(target).style.transform = `translate(${location.X}px, ${location.Y}px)`

    }
})




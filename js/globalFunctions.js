import {gamePrefs} from '/js/globals.js';

/**
 * Función para mostrar texto con efecto de mecanografía
 * @param {Phaser.GameObjects.Text} textObject - El objeto de texto donde se mostrará el efecto
 * @param {dialogObject} secuencia - El dialogo que se debe mecanografiar
 * @param {number} speed - Velocidad en milisegundos entre cada carácter
 */
export function typeEffectText(scene, textObject, secuencia, speed = 100, _currentIndex = 0) 
{
    let currentIndex = _currentIndex;  // Índice de la secuencia de diálogos
    let currentLetterIndex = 0;  // Índice de la letra que estamos mostrando
    let currentText = '';  // El texto actual que estamos escribiendo
    let typingInterval;  // Para manejar el intervalo de las letras

    // Función para iniciar el efecto de escritura de una letra por vez
    function writeLetter() 
    {
        if (currentLetterIndex < currentText.length) 
        {
            modularSound()
            textObject.setText(currentText.substring(0, currentLetterIndex + 1));
            currentLetterIndex++;
        } 
        else 
        {
            clearInterval(typingInterval);  // Detener el intervalo cuando termine de escribir
        }
    }

    function modularSound()
    {
        scene.sound.play('keySound', {
            rate: secuencia[currentIndex -1].personaje === 'alumno' ? gamePrefs.soundMIN/100 : gamePrefs.soundMAX/100
        });
    }

    // Configurar lo que ocurre cuando se presiona la barra espaciadora
    scene.input.keyboard.on('keydown-SPACE', () => 
    {
        if (currentLetterIndex === currentText.length) 
        {
            // Si ya terminamos de escribir el texto actual, avanzamos al siguiente diálogo
            if (currentIndex < secuencia.length) 
            {
                const currentDialog = secuencia[currentIndex];

                if (currentDialog.tipo === 'accion') 
                {
                    // Si el tipo es "accion", ejecutar la función correspondiente
                    currentIndex++;
                    scene.handleAction(currentDialog.accion, currentIndex);
                    // No se avanza en el índice hasta que la acción termine o se haya procesado
                    // Detener el avance para no continuar con el diálogo inmediatamente
                    return;
                }
                else
                {
                    // Establecer el color según el personaje
                    const textColor = currentDialog.personaje === 'alumno' ? '0xffffff' : '0xff0000';

                    // Establecer el texto a escribir
                    currentText = currentDialog.texto;
                    textObject.setTint(textColor);  // Cambiar el color según el personaje

                    // Inicializar las variables de texto
                    currentLetterIndex = 0;
                    // Comenzar a escribir el nuevo texto
                    typingInterval = setInterval(writeLetter, speed);
                    // Avanzar a la siguiente parte de la secuencia
                    currentIndex++;
                }  
            }
        }
    });
}

export function writeName(scene, textObject, currentIndex)
{
    // Variable para almacenar el nombre que el jugador escribe
    let playerName = '';
    // Mostrar un mensaje inicial en el objeto de texto
    textObject.setTint(0xFFFFFF);  
    textObject.setText('');

    // Configurar lo que ocurre cuando se presiona una tecla
    scene.input.keyboard.on('keydown', function handleInput(event)
    {
        console.log(event.key); 
        if (event.key === 'Backspace') {
            // Si se presiona 'Backspace', eliminar el último carácter del nombre
            playerName = playerName.slice(0, -1);
        } 
        else if (event.key === 'Enter') 
        {
            // Si se presiona 'Enter', guardar el nombre en gamePrefs.STUDENT_NAME
            gamePrefs.STUDENT_NAME = playerName;
            scene.input.keyboard.off('keydown', handleInput); 
            scene.init();
            typeEffectText(scene, scene.dialogTextObject, scene.secuencia, scene.speed, currentIndex);
        } 
        else if (event.key.length === 1) 
        {
            // Si es una tecla normal (letra o número), agregarla al nombre
            playerName += event.key;
        }
        // Actualizar el texto mostrado con el nombre que el jugador ha escrito
        textObject.setText(playerName);
    }, scene);
}


export function dialogAppear(_scene, _dialogTextObject, _textDialog, _speed = 100)
{
    // Detenemos cualquier tween activo si ya hay uno en curso
    if (_scene.tweens.isTweening(_dialogTextObject)) 
    {
        _scene.tweens.killTweensOf(_dialogTextObject);  // Detener el tween actual si esta desapareciendo
    }

    // Inicializamos la variable de índice y el texto vacío
    let currentLetterIndex = 0;
    _dialogTextObject.setText('').setTint('0xFF0000').setVisible(true);;  // Limpiamos el texto antes de empezar a escribir
    _dialogTextObject.alpha = 1;

    // Función para escribir una letra a la vez
    function writeLetter() {
        if (currentLetterIndex < _textDialog.length) 
        {
            _scene.sound.play('keySound', { rate: 1.2 });
            // Añadimos una letra al texto mostrado
            _dialogTextObject.setText(_textDialog.substring(0, currentLetterIndex + 1));
            currentLetterIndex++;
        } 
        else 
        {
            // Cuando todo el texto haya sido mostrado, comenzamos a desaparecer el diálogo
            dialogDisappear(_scene, _dialogTextObject);
            typingEvent.remove(); 
        }
    };

    // Crear el efecto de escritura (letra por letra)
    let typingEvent = _scene.time.addEvent({
        delay: _speed, // Intervalo entre letras
        callback: writeLetter,
        loop: true, // Repetir mientras no se haya escrito todo el texto
    });
}

// LLamamos esta función con el tiempo que queremos que tarde en desaparezer
export function dialogDisappear(_scene, _dialogTextObject, _time = 3)
{  
    _scene.tweens.add({
        targets: _dialogTextObject,
        alpha: 1,
        duration: _time * 1000, // Duración de la desaparición
        ease: 'Linear', 
        onComplete: () => {
            _dialogTextObject.setVisible(false); // Lo seteamos a invisible por si acaso
        }
    });
}

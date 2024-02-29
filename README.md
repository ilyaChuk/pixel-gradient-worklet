# Градиент из пикселей с шумом
Это [CSS Paint Worklet](https://developer.mozilla.org/en-US/docs/Web/API/CSS_Painting_API/Guide) для создания моего любимого эффекта градиента, состоящего из больших пикселей. И каждый пиксель содержит немного шума. [Тут демо](https://ilyachuk.github.io/pixel-gradient-worklet/).
![Alt text](<readme images/grad3.webp>)
<details>
  <summary>Ещё примеры</summary>

  - ![Alt text](<readme images/ngrad1.webp>)
  - ![Alt text](<readme images/ngrad2.webp>)
  - ![Alt text](<readme images/ngrad4.webp>)
</details>

Важный момент. Это не градиент поверх пикселей. Это градиент **состоящий из** пикселей. Лучше заметно при увеличении:
![Alt text](<readme images/largeGrad.webp>)

## Установка
Можно скачать файл модуля `pixel-gradient-worklet.js` и подключать. Или используйте из unpkg. Затем добавить класс к `<html>` чтобы через CSS можно было понимать, установился ли worklet.
```html
<script>
	if ("paintWorklet" in CSS) {
		CSS.paintWorklet.addModule("pixel-gradient-worklet.js")
		// или
		CSS.paintWorklet.addModule("https://www.unpkg.com/pixel-gradient-worklet/index.js")
		document.getElementsByTagName('html')[0].classList.add('pixelGradient')
	}
</script>
```
## Использование
Модуль может не подключиться из-за устаревших браузеров – это надо учитывать в CSS и делать 2 вида стилей:
```css
.colorfullBlock{
	background: linear-gradient(#00ff00, #ff0000);
}
html.pixelGradient .colorfullBlock{
	--gradient-start: #00ff00;
	--gradient-end: #ff0000;
	--square-size: 7;
	--noise-intensity: 20;
	background: paint('pixelGradient');
}
```
Именно в таком порядке. Снача дефолтные, потом в случае если `<html>` имеет `.pixelGradient`.

### Параметры
- Цвета должны быть валидными hex.
- `--gradient-start: #00ff00;` – Первый цвет
- `--gradient-end: #ff0000;` – Второй цвет
-  
- `--square-size: 7;` – Размер пикселей (квадратиков). Чем меньше размер и чем больше размер блока, тем больше нагрузка при перерисовках.
- `--noise-intensity: 20;` – Сила шума. Для одного и того же визуального эффекта шума на разных цветах нужно разное значение. Около красного, зелёного или синего нужно большее значение `--noise-intensity`.
- `--gradient-angle` – Угол направления градиента.
- `--seed` – Сид для шума. По умолчанию всегда 12345.

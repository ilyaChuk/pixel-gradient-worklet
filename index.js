class SeedRandom {
	constructor(seed) {
		this.seed = seed;
	}

	random(x, y) {
		var hash = (x + y * 57) * 57 + this.seed;
		hash = Math.sin(hash) * 10000;
		return hash - Math.floor(hash);
	}
}

class GradientSquares {
	static get inputProperties() {
		return ['--gradient-start', '--gradient-end', '--gradient-angle', '--square-size', '--noise-intensity', '--seed'];
	}

	paint(ctx, size, properties) {
		const startColor = properties.get('--gradient-start').toString().trim();
		const endColor = properties.get('--gradient-end').toString().trim();
		let angle = parseFloat(properties.get('--gradient-angle').toString()) || 0;
		let squareSize = parseInt(properties.get('--square-size').toString()) || 5;
		const noiseIntensity = parseFloat(properties.get('--noise-intensity').toString()) || 25;
		const seed = parseInt(properties.get('--seed').toString()) || 12345;

		// Коррекция угла
		angle = angle % 360;
		if (angle < 0) angle += 360; // Нормализация отрицательного угла
		squareSize = Math.max(1, squareSize);

		const seedRandom = new SeedRandom(seed);
		const startRGB = this.hexToRgb(startColor);
		const endRGB = this.hexToRgb(endColor);

		const width = size.width;
		const height = size.height;

		// Преобразование угла в радианы для расчетов
		const angleRad = (angle * Math.PI) / 180;

		for (let y = 0; y < height; y += squareSize) {
			for (let x = 0; x < width; x += squareSize) {
				// Учет угла для определения позиции квадрата в градиенте
				const dx = x - width / 2;
				const dy = y - height / 2;
				const distance = dx * Math.cos(angleRad) + dy * Math.sin(angleRad);
				const maxDistance = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2);
				const ratio = (distance + maxDistance) / (2 * maxDistance);

				const noise = (seedRandom.random(x / squareSize, y / squareSize) * 2 - 1) * noiseIntensity;

				const color = this.applyNoiseToColor(startRGB, endRGB, ratio, noise);

				ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
				ctx.fillRect(x, y, squareSize, squareSize);
			}
		}
	}

	applyNoiseToColor(startRGB, endRGB, ratio, noise) {
		let r = startRGB.r + ratio * (endRGB.r - startRGB.r);
		let g = startRGB.g + ratio * (endRGB.g - startRGB.g);
		let b = startRGB.b + ratio * (endRGB.b - startRGB.b);

		// Применяем шум, убедившись, что значения остаются в диапазоне [0, 255]
		r = Math.max(0, Math.min(255, r + noise));
		g = Math.max(0, Math.min(255, g + noise));
		b = Math.max(0, Math.min(255, b + noise));

		return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
	}

	hexToRgb(hex) {
		let r = 0, g = 0, b = 0;
		hex = hex.replace(/^#/, '');
		if (hex.length === 3) {
			r = parseInt(hex[0] + hex[0], 16);
			g = parseInt(hex[1] + hex[1], 16);
			b = parseInt(hex[2] + hex[2], 16);
		} else if (hex.length === 6) {
			r = parseInt(hex.slice(0, 2), 16);
			g = parseInt(hex.slice(2, 4), 16);
			b = parseInt(hex.slice(4, 6), 16);
		}
		return { r, g, b };
	}
}

registerPaint('gradientSquares', GradientSquares);
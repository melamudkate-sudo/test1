# Изображения и шрифты

- `assets/5100-black.png`: исходное фото пользователя из папки «Модели для сайта», файл 5100bl.png.
- `assets/5100-cutout.png`: копия для прототипа с удалённым фоном, встроенный imagegen. Оригинал не изменён. Перед публичным размещением сверить мелкие детали панели/логотипа с официальной фотографией.
- `assets/logo.svg`: предоставленный векторный логотип; технически убраны пустые поля через viewBox.
- `assets/logo-white.svg`: тот же полный векторный логотип с белыми буквами и красным акцентом для тёмного фона. Предоставленный файл «Белый.svg» содержал только акцент, поэтому использованы полные исходные контуры из чёрного SVG.
- Montserrat и Exo 2: Google Fonts, локальные TTF; SIL Open Font License включены в assets/fonts.

## Точный запрос imagegen

Use case: background-extraction. Edit target: supplied photograph of a black DEMIAND 5100 air fryer. Remove ONLY the white background and floor shadow to give a clean genuinely transparent PNG cutout. Keep exact black appliance geometry, perspective, top controls, handle, window and the food inside, all silver details and DEMIAND logo unchanged. Center complete appliance, no parts cropped, tight but small transparent margins, no new elements or relighting. Intended asset: dark premium technology landing page.

Выход: transparent_background=true, встроенный инструмент; PNG 1280 × 1280. Итоговый файл находится внутри проекта, внешние пути для работы сайта не нужны.

## Пользовательский ролик главного экрана

Источник: `/Users/aggesiya/Downloads/hf_20261006_112836_f69cb24c-b497-45e1-9317-47fb49d0829c.mov`. Передан пользователем для сжатия и размещения. ProRes 4444, 1440×1440, alpha, 121 кадр. WebM перекодирован ffmpeg/libvpx-vp9 (1080, CRF 36; 720, CRF 38), без звука и метаданных. HEVC alpha создан локальным AVAssetWriter Apple (1080×1080). [Документация Apple о HEVC с прозрачностью](https://developer.apple.com/documentation/avfoundation/avassetexportpresethevchighestqualitywithalpha). Постер извлечён из кадра исходника и сохранён в прозрачный WebP. Исходный файл не изменялся.

## Видео цифрового аэрогриля — 8 октября

Источник пользователя: Downloads/Pre-comp 1.mp4, 8 724 131 байт, 1080 × 1080, 24 fps, 4,54 секунды. Версия сайта: assets/5100-code-loop.mp4, H.264 CRF 19, slow, без аудио, fast start. Постер assets/5100-code-poster.webp из кадра 1,4 секунды. Содержание видео не изменялось.

Пользовательские медиа 08.10.2026: DEMIAND_AI_Animation.mp4 — горизонтальный ролик без перекодирования; image (5).png — заглушка 900 × 900 WebP, та же обрезка, что у hero-видео.

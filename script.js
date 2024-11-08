fetch('api_key.txt')
    .then(response => response.text())
    .then(apiKey => {
        mapboxgl.accessToken = apiKey.trim();

        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [19.145136, 51.919438],
            zoom: 5
        });

        document.getElementById('locate-btn').addEventListener('click', function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var userLocation = [position.coords.longitude, position.coords.latitude];
                    map.flyTo({center: userLocation, zoom: 12});
                    new mapboxgl.Marker().setLngLat(userLocation).addTo(map);
                });
            }
        });

        var pieces = [];
        var droppables = [];
        document.getElementById('generate-btn').addEventListener('click', function() {
            generateRaster();
        });

        function generateRaster() {
            var center = map.getCenter();
            var zoom = map.getZoom();
            var mapElement = document.getElementById('map');
            var width = mapElement.offsetWidth;
            var height = mapElement.offsetHeight;

            var apiKey = mapboxgl.accessToken;
            var style = 'mapbox/streets-v11';
            var url = `https://api.mapbox.com/styles/v1/${style}/static/${center.lng},${center.lat},${zoom},0,0/${width}x${height}?access_token=${apiKey}`;

            var img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = function() {
                splitImage(img, width, height);
            };
            img.src = url;
        }

        function splitImage(img, width, height) {
            var pieceWidth = width / 4;
            var pieceHeight = height / 4;
            pieces = [];
            for (var row = 0; row < 4; row++) {
                for (var col = 0; col < 4; col++) {
                    var canvas = document.createElement('canvas');
                    canvas.width = pieceWidth;
                    canvas.height = pieceHeight;
                    var ctx = canvas.getContext('2d');
                    ctx.drawImage(img, col * pieceWidth, row * pieceHeight, pieceWidth, pieceHeight, 0, 0, pieceWidth, pieceHeight);
                    var dataURL = canvas.toDataURL();
                    pieces.push({img: dataURL, index: row * 4 + col});
                }
            }
            shuffleArray(pieces);
            renderPieces(pieceWidth, pieceHeight);
            setupDroppables(pieceWidth, pieceHeight);
        }

        function renderPieces(pieceWidth, pieceHeight) {
            var container = document.getElementById('pieces-container');
            container.innerHTML = '';
            pieces.forEach(function(piece) {
                var img = document.createElement('img');
                img.src = piece.img;
                img.className = 'piece';
                img.draggable = true;
                img.dataset.index = piece.index;
                img.style.width = pieceWidth + 'px';
                img.style.height = pieceHeight + 'px';
                img.addEventListener('dragstart', dragStart);
                container.appendChild(img);
            });
        }

        function setupDroppables(pieceWidth, pieceHeight) {
            var rightPanel = document.getElementById('right-panel');
            rightPanel.innerHTML = '';
            droppables = [];
            for (var i = 0; i < 16; i++) {
                var div = document.createElement('div');
                div.className = 'dropzone';
                div.dataset.index = i;
                var top = Math.floor(i / 4) * pieceHeight;
                var left = (i % 4) * pieceWidth;
                div.style.top = top + 'px';
                div.style.left = left + 'px';
                div.style.width = pieceWidth + 'px';
                div.style.height = pieceHeight + 'px';
                div.addEventListener('dragover', dragOver);
                div.addEventListener('drop', drop);
                rightPanel.appendChild(div);
                droppables.push(div);
            }
        }

        function dragStart(e) {
            e.dataTransfer.setData('text/plain', e.target.dataset.index);
        }

        function dragOver(e) {
            e.preventDefault();
        }

        function drop(e) {
            e.preventDefault();
            var draggedIndex = e.dataTransfer.getData('text/plain');
            var targetIndex = e.target.dataset.index;

            var draggedPiece = document.querySelector('.piece[data-index="'+draggedIndex+'"]');
            var targetPiece = e.target.firstChild;

            if (targetPiece && targetPiece !== draggedPiece) {
                var sourceParent = draggedPiece.parentNode;
                var targetParent = targetPiece.parentNode;

                sourceParent.replaceChild(targetPiece, draggedPiece);
                targetParent.appendChild(draggedPiece);
            } else {
                e.target.appendChild(draggedPiece);
            }

            checkSolution();
        }

        function checkSolution() {
            var correct = true;
            droppables.forEach(function(dropzone) {
                var piece = dropzone.firstChild;
                if (piece) {
                    if (parseInt(piece.dataset.index) !== parseInt(dropzone.dataset.index)) {
                        correct = false;
                    }
                } else {
                    correct = false;
                }
            });
            if (correct) {
                console.log('Poprawny')
                document.getElementById('message').textContent = 'Gratulacje!';
            } else {
                console.log('Niepoprawny')
                document.getElementById('message').textContent = '';
            }
        }

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        }

    });

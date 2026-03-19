let map;

function generateMap() {
    const seed = Number(document.getElementById("seedInput").value);

    if (!seed) {
        alert("Entre un seed valide !");
        return;
    }

    if (map) map.remove();

    map = L.map('map').setView([0, 0], 3);

    // Fond de carte vide (Minecraft-style)
L.tileLayer('', {
    maxZoom: 6
}).addTo(map);

    // Ajout d'un fond gris clair pour simuler une carte Minecraft
L.rectangle([[-1000, -1000], [1000, 1000]], {
    color: "#888",
    fillColor: "#ccc",
    fillOpacity: 0.5
}).addTo(map);

    // Génération pseudo-aléatoire basée sur le seed
    function rand(x, z) {
        return Math.abs(Math.sin(seed + x * 12.9898 + z * 78.233) * 43758.5453) % 1;
    }

    // Ajouter des villages
    if (document.getElementById("villages").checked) {
        for (let x = -5; x <= 5; x++) {
            for (let z = -5; z <= 5; z++) {
                if (rand(x, z) > 0.92) {
                    L.marker([z * 10, x * 10]).addTo(map)
                        .bindPopup("Village");
                }
            }
        }
    }

    // Ajouter des temples
    if (document.getElementById("temples").checked) {
        for (let x = -5; x <= 5; x++) {
            for (let z = -5; z <= 5; z++) {
                if (rand(x, z) > 0.97) {
                    L.marker([z * 10, x * 10], { icon: L.icon({
                        iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
                        iconSize: [25, 25]
                    })}).addTo(map)
                        .bindPopup("Temple");
                }
            }
        }
    }

    // Biomes (zones colorées)
    if (document.getElementById("biomes").checked) {
        for (let x = -5; x <= 5; x++) {
            for (let z = -5; z <= 5; z++) {
                const r = rand(x, z);

                let color = "#228B22"; // forêt
                if (r > 0.66) color = "#C2B280"; // désert
                if (r < 0.33) color = "#87CEEB"; // neige

                L.rectangle([
                    [z * 10 - 5, x * 10 - 5],
                    [z * 10 + 5, x * 10 + 5]
                ], { color: color, fillOpacity: 0.4 }).addTo(map);
            }
        }
    }
}

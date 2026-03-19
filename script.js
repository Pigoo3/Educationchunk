let map;

function generateMap() {
    const seed = Number(document.getElementById("seedInput").value);

    if (!Number.isFinite(seed) && seed !== 0) {
        alert("Entre un seed valide !");
        return;
    }

    if (map) map.remove();

    const darkMode = document.getElementById("darkmode")?.checked;

    map = L.map('map', {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 4
    }).setView([0, 0], 0);

    const size = 2500;

    const bgColor = darkMode ? "#18181b" : "#d4d4d8";
    const gridColor = darkMode ? "#3f3f46" : "#a1a1aa";

    L.rectangle([[-size, -size], [size, size]], {
        color: gridColor,
        fillColor: bgColor,
        fillOpacity: 1
    }).addTo(map);

    for (let x = -size; x <= size; x += 100) {
        L.polyline([[-size, x], [size, x]], { color: gridColor, weight: 1, opacity: 0.4 }).addTo(map);
        L.polyline([[x, -size], [x, size]], { color: gridColor, weight: 1, opacity: 0.4 }).addTo(map);
    }

    function rand(x, z, extra = 0) {
        return Math.abs(Math.sin(seed + x * 12.9898 + z * 78.233 + extra) * 43758.5453) % 1;
    }

    const showBiomes = document.getElementById("biomes")?.checked;
    const showVillages = document.getElementById("villages")?.checked;
    const showTemples = document.getElementById("temples")?.checked;
    const showOres = document.getElementById("ores")?.checked;
    const showNether = document.getElementById("nether")?.checked;
    const showStrongholds = document.getElementById("strongholds")?.checked;
    const showEnd = document.getElementById("end")?.checked;
    const showGeodes = document.getElementById("geodes")?.checked;
    const showMineshafts = document.getElementById("mineshafts")?.checked;

    const biomeMap = {};

    // BIOMES
    if (showBiomes) {
        for (let x = -12; x <= 12; x++) {
            for (let z = -12; z <= 12; z++) {
                const r = rand(x, z);
                let color = "#166534";
                let name = "Plaine";

                if (r > 0.7) {
                    color = "#ca8a04";
                    name = "Désert";
                } else if (r < 0.25) {
                    color = "#e5e7eb";
                    name = "Neige";
                } else if (r > 0.4 && r < 0.55) {
                    color = "#14532d";
                    name = "Forêt";
                }

                biomeMap[`${x},${z}`] = name;

                L.rectangle([
                    [z * 100 - 50, x * 100 - 50],
                    [z * 100 + 50, x * 100 + 50]
                ], {
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.35
                }).addTo(map);
            }
        }
    }

    // VILLAGES (style selon biome)
    if (showVillages) {
        for (let x = -25; x <= 25; x++) {
            for (let z = -25; z <= 25; z++) {
                if (rand(x, z) > 0.93) {
                    const bx = Math.round(x / 2);
                    const bz = Math.round(z / 2);
                    const biome = biomeMap[`${bx},${bz}`] || "Inconnu";

                    let iconColor = "#facc15"; // plaine
                    if (biome === "Désert") iconColor = "#eab308";
                    if (biome === "Neige") iconColor = "#e5e7eb";
                    if (biome === "Forêt") iconColor = "#22c55e";

                    const villageMarker = L.circleMarker([z * 100, x * 100], {
                        radius: 7,
                        color: "#000",
                        weight: 1,
                        fillColor: iconColor,
                        fillOpacity: 0.95
                    });

                    villageMarker.addTo(map)
                        .bindPopup(`Village (${biome})<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    // TEMPLES
    if (showTemples) {
        for (let x = -25; x <= 25; x++) {
            for (let z = -25; z <= 25; z++) {
                if (rand(x, z, 100) > 0.97) {
                    L.circleMarker([z * 100, x * 100], {
                        radius: 9,
                        color: "#b45309",
                        fillColor: "#f97316",
                        fillOpacity: 0.95
                    }).addTo(map)
                        .bindPopup(`Temple<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    // MINERAIS
    if (showOres) {
        for (let x = -22; x <= 22; x++) {
            for (let z = -22; z <= 22; z++) {
                const r = rand(x, z, 200);
                if (r > 0.9) {
                    let color = "#9ca3af";
                    let ore = "Fer";

                    if (r > 0.96) {
                        color = "#22d3ee";
                        ore = "Diamant";
                    } else if (r > 0.93) {
                        color = "#facc15";
                        ore = "Or";
                    }

                    L.rectangle([
                        [z * 100 - 12, x * 100 - 12],
                        [z * 100 + 12, x * 100 + 12]
                    ], {
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.9
                    }).addTo(map)
                        .bindPopup(`${ore}<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    // NETHER (bastions + forteresses)
    if (showNether) {
        for (let x = -18; x <= 18; x++) {
            for (let z = -18; z <= 18; z++) {
                const r = rand(x, z, 300);
                if (r > 0.965) {
                    const isFortress = r > 0.985;
                    L.circleMarker([z * 100, x * 100], {
                        radius: isFortress ? 12 : 8,
                        color: isFortress ? "#7f1d1d" : "#a21caf",
                        fillColor: isFortress ? "#b91c1c" : "#e879f9",
                        fillOpacity: 0.95
                    }).addTo(map)
                        .bindPopup(`${isFortress ? "Forteresse du Nether" : "Bastion"}<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    // STRONGHOLDS (3 en anneau)
    if (showStrongholds) {
        for (let i = 0; i < 3; i++) {
            const angle = (Math.PI * 2 * i) / 3;
            const radius = 1400 + (rand(i, i, 400) * 400);
            const x = Math.round((Math.cos(angle) * radius) / 100);
            const z = Math.round((Math.sin(angle) * radius) / 100);

            L.circleMarker([z * 100, x * 100], {
                radius: 14,
                color: "#16a34a",
                fillColor: "#22c55e",
                fillOpacity: 0.95
            }).addTo(map)
                .bindPopup(`Stronghold<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
        }
    }

    // END (end cities approximatives)
    if (showEnd) {
        for (let i = 0; i < 10; i++) {
            const angle = rand(i, i, 500) * Math.PI * 2;
            const radius = 1800 + rand(i, i, 600) * 600;
            const x = Math.round((Math.cos(angle) * radius) / 100);
            const z = Math.round((Math.sin(angle) * radius) / 100);

            L.circleMarker([z * 100, x * 100], {
                radius: 10,
                color: "#4c1d95",
                fillColor: "#a855f7",
                fillOpacity: 0.95
            }).addTo(map)
                .bindPopup(`End City (approx.)<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
        }
    }

    // GÉODES
    if (showGeodes) {
        for (let x = -20; x <= 20; x++) {
            for (let z = -20; z <= 20; z++) {
                const r = rand(x, z, 700);
                if (r > 0.965) {
                    L.circleMarker([z * 100, x * 100], {
                        radius: 6,
                        color: "#4c1d95",
                        fillColor: "#c4b5fd",
                        fillOpacity: 0.95
                    }).addTo(map)
                        .bindPopup(`Géode d'améthyste<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    // MINESHAFTS
    if (showMineshafts) {
        for (let x = -22; x <= 22; x++) {
            for (let z = -22; z <= 22; z++) {
                const r = rand(x, z, 900);
                if (r > 0.965) {
                    L.rectangle([
                        [z * 100 - 20, x * 100 - 5],
                        [z * 100 + 20, x * 100 + 5]
                    ], {
                        color: "#78350f",
                        fillColor: "#92400e",
                        fillOpacity: 0.9
                    }).addTo(map)
                        .bindPopup(`Mineshaft<br>Seed : ${seed}<br>X: ${x * 100} | Z: ${z * 100}`);
                }
            }
        }
    }

    const coordsDiv = document.getElementById("coords");
    if (coordsDiv) {
        map.on('mousemove', function (e) {
            const x = Math.round(e.latlng.lng);
            const z = Math.round(e.latlng.lat);
            coordsDiv.textContent = `X: ${x} | Z: ${z}`;
        });
    }
}

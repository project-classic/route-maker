function getZones() {
    return new Promise(
        function (resolve) {
            var something = {
                "1": "dun_morogh",
                "3": "badlands",
                "4": "blasted_lands",
                "8": "swamp_of_sorrows",
                "10": "duskwood",
                "11": "wetlands",
                "12": "elwynn_forest",
                "14": "durotar",
                "15": "dustwallow_marsh",
                "16": "azshara",
                "17": "the_barrens",
                "28": "western_plaguelands",
                "33": "stranglethorn_vale",
                "36": "alterac_mountains",
                "38": "loch_modan",
                "40": "westfall",
                "41": "deadwind_pass",
                "44": "redridge_mountains",
                "45": "arathi_highlands",
                "46": "burning_steppes",
                "47": "the_hinterlands",
                "51": "searing_gorge",
                "85": "tirisfal_glades",
                "130": "silverpine_forest",
                "139": "eastern_plaguelands",
                "141": "teldrassil",
                "148": "darkshore",
                "215": "mulgore",
                "267": "hillsbrad_foothills",
                "331": "ashenvale",
                "357": "feralas",
                "361": "felwood",
                "400": "thousand_needles",
                "405": "desolace",
                "406": "stonetalon_mountains",
                "440": "tanaris",
                "490": "ungoro_crater",
                "493": "moonglade",
                "618": "winterspring",
                "1497": "undercity",
                "1519": "stormwind_city",
                "1537": "ironforge",
                "1637": "orgrimmar",
                "1638": "thunder_bluff",
                "1657": "darnassus"
            }
            resolve(something)
        }
    )
}
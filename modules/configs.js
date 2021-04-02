export const LIMIT_SEACH_ITEMS = 50;

export var location = await set_location();
export var meli_site_id = get_site_id(location.region_name);

async function set_location() {
    console.log("get_contry_code()")
    let repsonse = await fetch("http://ip-api.com/json")

    let json = await repsonse.json()

    let location = { "country_code": json.countryCode, "region_name": json.regionName }
    console.log(location)

    return location;
}

function get_site_id(country_name) {
    switch (country_name) {
        case "Perú": return "MPE";
        case "Colombia": return "MCO";
        case "Chile": return "MLC";
        case "Uruguay": return "MLU";
        case "Argentina": return "MLA";
        case "Paraguay": return "MPY";
        case "Mexico": return "MLM";
        case "Panamá": return "MPA";
        case "Costa Rica": return "MCR";
        case "Ecuador": return "MEC";
        case "El Salvador": return "MSV";
        case "Cuba": return "MCU";
        case "Guatemala": return "MGT";
        case "Nicaragua": return "MNI";
        case "Bolivia": return "MBO";
        case "Honduras": return "MHN";
        case "Nicaragua": return "MNI";
        case "Venezuela": return "MLV";
        case "Brasil": return "MLB";
        case "Dominicana": return "MRD";
        default: return "MLA";
    }
}
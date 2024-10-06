//Se anadio la extension json as code para poder generar el objeto de la respuesta de pokemon
//usamos esta interfaz para definir la estructura de la respuesta de la api de pokemon

export interface PokeResponse {
    count:    number;
    next:     string;
    previous: null;
    results:  Result[];
}

export interface Result {
    name: string;
    url:  string;
}


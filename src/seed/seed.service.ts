import { BadRequestException, Injectable } from '@nestjs/common';
import axios, { AxiosInstance} from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from 'src/adapters/axios.adapter';


@Injectable()
export class SeedService {
  
  constructor(
    @InjectModel( Pokemon.name) 
      private readonly pokemonModel: Model<Pokemon>,
      private readonly http: AxiosAdapter
    ) {}
  async executeSeed()  {
    try {
      //delete all the data
    await this.pokemonModel.deleteMany({});
     // Access the API and get the data
    const  data  = await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=650");
    const pokemonToInsert = [];
    data.results.forEach( ({ name , url}) => {
      const segments = url.split("/");
      const no =+ segments[segments.length - 2];

      // pokemonToInsert.push(this.pokemonModel.create({no, name}));
      pokemonToInsert.push(new this.pokemonModel({no, name}));
      
      
    });
    //Esperamos a que todas las inserciones se completen
    // await Promise.all(pokemonToInsert);//Tambien se puede hacer con Promise.all
    await this.pokemonModel.insertMany(pokemonToInsert);//Insert Into DB
    return {
      status : true,
      msj : 'Pokemons Inserted',
      counts : pokemonToInsert.length,
      data : pokemonToInsert
    };
    

    }catch(ex){
      throw new BadRequestException(ex.message);
    } 
  }
}

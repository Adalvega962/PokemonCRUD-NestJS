import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel( Pokemon.name) 
      private readonly pokemonModel: Model<Pokemon>
    ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try{
      createPokemonDto.name = createPokemonDto.name.toLowerCase();
      const pokemon =  await this.pokemonModel.create(createPokemonDto);
      console.log(pokemon);
      
      return {
        status : true,
        msj : 'OK',
        data : pokemon
      }
    }catch(e){
      this.handleExceptions(e);
    }
  }
  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne(term: string) {
    try{
      let pokemon : Pokemon;
      if( !isNaN(+term)){
        // hacemos una busqueda por term
        pokemon = await this.pokemonModel.findOne({no : term});
      }
        //Para encontrar por id de MongoID
      if(!pokemon && isValidObjectId(term)){
        pokemon = await this.pokemonModel.findById(term );
      }

      //buscamos por nombre
      if(!pokemon){
        pokemon = await this.pokemonModel.findOne({name : term.toLowerCase().trim()});
      }

      if(!pokemon){
        throw new BadRequestException('Pokemon not found'); 
      }
      
      //si encontramos el pokemon lo retornamos
      return {
        status : true,
        msj : 'OK',
        data : pokemon
      }
      
    }catch(e){
      return {
        status : false,
        msj : 'Error finding pokemon ' + e.message,
        data : []
      }
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try{
      // const pokemon = await this.findOne(term)
      // if send the name pokemon , convert to lowercase'
      if(updatePokemonDto.name)
        updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
  
       // Actualiza el Pokémon en la base de datos
       const updatedPokemon = await this.pokemonModel.findOneAndUpdate(
        { name: term.toLowerCase().trim() }, // Filtro para encontrar el Pokémon
        updatePokemonDto, // Datos para actualizar
        { new: true } // Opciones: devuelve el documento actualizado
      );
      // Si no se encuentra el Pokémon, lanzamos un error
      if (!updatedPokemon) {
        throw new BadRequestException('Pokemon not found');
      }
      return updatedPokemon;
    }catch(exception){
      this.handleExceptions(exception);
    }
  }

  private handleExceptions( error : any){
    
      if(error.code === 11000){
        throw new BadRequestException(`Pokemon already exists with that name ${JSON.stringify(error.keyValue)}`);
      }
        throw new BadRequestException('Error creating pokemon');
  }
  
   async remove(id: string) {
    try{
      const pokemon = await this.pokemonModel.findByIdAndDelete(id);
      if(!pokemon){
        throw new BadRequestException('Pokemon not found');
      }
      return {
        status : true,
        msj : 'Pokemon deleted',
        data : pokemon
      }
    }catch( Exception ){
      return {
        status : false,
        msj : 'Error deleting pokemon ' + Exception.message,
        data : []
      }
    }
  }

  async removeWithPipes (id : string ) {

    const { deletedCount , acknowledged} = await this.pokemonModel.deleteOne({ _id : id});
    // const result = await this.pokemonModel.deleteOne({ _id : id});//Es lo mismo solo que el anterior es destructurado
    if (deletedCount == 0) {
      throw new BadRequestException('Pokemon not found with id ' + id);
    }
    return {
      status : true,
      msj : 'Pokemon deleted',
      data : id
    }
  }
  
}

import { IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {
    // has to be number, positive and minimum 1
    @IsInt()
    @Min(1)
    @IsPositive()
    no: number;
    // has to be string, minimum length 1
    @IsString()
    @MinLength(1)
    name: string;
}

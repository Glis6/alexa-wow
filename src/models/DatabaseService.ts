import {CharacterData} from "../services/DynamoDbService";

export interface DatabaseService {
    getCharacterDataForCharacter(character: string): Promise<CharacterData>;
    insertCharacterData(characterData: CharacterData): Promise<void>;
}
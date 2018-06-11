import {CharacterData} from "../services/DynamoDbService";

export interface DatabaseService {
    /**
     * @param {string} character The character to look up.
     * @returns {Promise<CharacterData>} The data of the character we got.
     */
    getCharacterDataForCharacter(character: string): Promise<CharacterData>;

    /**
     * @param {CharacterData} characterData The data of the character to insert.
     */
    insertCharacterData(characterData: CharacterData): Promise<void>;
}
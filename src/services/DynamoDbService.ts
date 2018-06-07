import {DatabaseService} from "../models/DatabaseService";
import {Credentials, DynamoDB} from "aws-sdk";
import {isNullOrUndefined} from "util";

/**
 * Configure AWS environment.
 */
require('aws-sdk').config.update({
    region: process.env.aws_region,
    credentials: new Credentials(process.env.aws_access_key_id, process.env.aws_secret_access_key)
});

export class DynamoDbService implements DatabaseService {
    /**
     * The database we're using to access the data.
     */
    private readonly database = new DynamoDB();

    getCharacterDataForCharacter(character: string): Promise<CharacterData> {
        return new Promise<CharacterData>((resolve, reject) => {
            this.database.getItem({
                TableName: 'character',
                Key: {
                    character: {S: character}
                }
            }, (err, data) => {
                if (err)
                    return reject(err);
                let result;
                if(data && !isNullOrUndefined(data) && data.Item) {
                    result = {
                        character: data.Item.character.S || undefined,
                        realm: data.Item.realm.S || undefined,
                        region:data.Item.region.S || undefined,
                        automaticUse: data.Item.automaticUse.BOOL || undefined
                    };
                }
                resolve(result);
            });
        });
    }

    insertCharacterData(characterData: CharacterData): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.database.putItem({
                TableName: 'character',
                Item: {
                    character: { S: characterData.character },
                    realm: { S: characterData.realm },
                    region: { S: characterData.region },
                    automaticUse: { BOOL: false }
                }
            }, err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

export class CharacterData {
    character: string;
    realm: string;
    region: string;
    automaticUse: boolean;
}
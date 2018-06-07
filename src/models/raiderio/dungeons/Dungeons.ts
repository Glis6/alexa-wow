export class Dungeon {
    fullName: string;
    shortName: string;
    commonName: string;
}

export const cathedralOfTheEternalNight: Dungeon = {
    fullName: "Cathedral of Eternal Night",
    shortName: "COEN",
    commonName: "Cathedral"
};

export const vaultOfTheWardens: Dungeon = {
    fullName: "Vault of the Wardens",
    shortName: "VOTW",
    commonName: "Vault"
};

export const blackRookHold: Dungeon = {
    fullName: "Black Rook Hold",
    shortName: "BRH",
    commonName: "BRH"
};

export const nelthalionsLair: Dungeon = {
    fullName: "Nelthalion's Lair",
    shortName: "NL",
    commonName: "Nelthalion's"
};

export const darkheartThicket: Dungeon = {
    fullName: "Darkheart Thicket",
    shortName: "DHT",
    commonName: "Darkheart"
};

export const theArcway: Dungeon = {
    fullName: "The Arcway",
    shortName: "ARC",
    commonName: "Arcway"
};

export const mawOfSouls: Dungeon = {
    fullName: "Maw of Souls",
    shortName: "MOS",
    commonName: "Maw"
};

export const courtOfStars: Dungeon = {
    fullName: "Court of Stars",
    shortName: "COS",
    commonName: "Court"
};

export const lowerKarazhan: Dungeon = {
    fullName: "Return to Karazhan: Lower",
    shortName: "LOWR",
    commonName: "Lower"
};

export const hallsOfValor: Dungeon = {
    fullName: "Halls of Valor",
    shortName: "HOV",
    commonName: "Halls"
};

export const upperKarazhan: Dungeon = {
    fullName: "Return to Karazhan: Upper",
    shortName: "UPPR",
    commonName: "Upper"
};

export const eyeOfAzshara: Dungeon = {
    fullName: "Eye of Azshara",
    shortName: "EOA",
    commonName: "Eye"
};

export const seatOfTheTriumvirate: Dungeon = {
    fullName: "Seat of the Triumvirate",
    shortName: "SEAT",
    commonName: "Seat"
};

/**
 * A list of all dungeons.
 */
export const all: Dungeon[] = [
    cathedralOfTheEternalNight, vaultOfTheWardens, blackRookHold,
    nelthalionsLair, darkheartThicket, theArcway,
    mawOfSouls, courtOfStars, lowerKarazhan,
    hallsOfValor, upperKarazhan, eyeOfAzshara,
    seatOfTheTriumvirate
];

/**
 * Converts the name to the dungeon object.
 *
 * @param {string} names The names to convert.
 */
export const textToDungeon = (names: string[]) => {
    names = names.map(name => name.toLowerCase());
    if(names.indexOf("all") >= 0)
        return all;
    return all.filter(dungeon => names.indexOf(dungeon.shortName.toLowerCase()) >= 0 || names.indexOf(dungeon.fullName.toLowerCase()) >= 0 || names.indexOf(dungeon.commonName.toLowerCase()) >= 0);
};

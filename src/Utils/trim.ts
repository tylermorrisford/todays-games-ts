const trimName = (fullName: string): string => {
    if (fullName === "Detroit Red Wings") return "Red Wings";
    if (fullName === "Columbus Blue Jackets") return "Blue Jackets";
    if (fullName === "St. Louis Blues") return "Blues";
    return fullName.split(" ")[(fullName.split(" ").length - 1)]
}

export default trimName;
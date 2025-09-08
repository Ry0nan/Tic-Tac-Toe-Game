// Player Factory Function
function Player(name, mark) {
    const playerName = name;
    const playerMark = mark;

    const getName = () => playerName;
    const getMark = () => playerMark;

    return { getName, getMark };
}

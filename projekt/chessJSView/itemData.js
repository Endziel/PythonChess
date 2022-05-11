var items = [
    {
        'name': 'Black King',
        'model': '/projekt/chessJSView/King.model.json',
        'black': true,
        'position': { x: -3, y: 0, z: 21 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Queen',
        'model': '/projekt/chessJSView/Queen.model.json',
        'black': true,
        'position': { x: 3, y: 0, z: 21 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Bishop 1',
        'model': '/projekt/chessJSView/Bishop.model.json',
        'black': true,
        'position': { x: 9, y: 0, z: 21 },
        'rotation': { x: 0, y: 90, z: 0 },
        'board': false
    }, {
        'name': 'Black Bishop 2',
        'model': '/projekt/chessJSView/Bishop.model.json',
        'black': true,
        'position': { x: -9, y: 0, z: 21 },
        'rotation': { x: 0, y: 90, z: 0 },
        'board': false
    }, {
        'name': 'Black Knight 1',
        'model': '/projekt/chessJSView/Knight.model.json',
        'black': true,
        'position': { x: 15, y: 0, z: 21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'Black Knight 2',
        'model': '/projekt/chessJSView/Knight.model.json',
        'black': true,
        'position': { x: -15, y: 0, z: 21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'Black Rook 1',
        'model': '/projekt/chessJSView/Rook.model.json',
        'black': true,
        'position': { x: 21, y: 0, z: 21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'Black Rook 2',
        'model': '/projekt/chessJSView/Rook.model.json',
        'black': true,
        'position': { x: -21, y: 0, z: 21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 1',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: -21, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 2',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: -15, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 3',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: -9, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 4',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: -3, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 5',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: 3, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 6',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: 9, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 7',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: 15, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Black Pawn 8',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': true,
        'position': { x: 21, y: 0, z: 15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White King',
        'model': '/projekt/chessJSView/King.model.json',
        'black': false,
        'position': { x: -3, y: 0, z: -21 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Queen',
        'model': '/projekt/chessJSView/Queen.model.json',
        'black': false,
        'position': { x: 3, y: 0, z: -21 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Bishop 1',
        'model': '/projekt/chessJSView/Bishop.model.json',
        'black': false,
        'position': { x: 9, y: 0, z: -21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'White Bishop 2',
        'model': '/projekt/chessJSView/Bishop.model.json',
        'black': false,
        'position': { x: -9, y: 0, z: -21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'White Knight 1',
        'model': '/projekt/chessJSView/Knight.model.json',
        'black': false,
        'position': { x: 15, y: 0, z: -21 },
        'rotation': { x: 0, y: 90, z: 0 },
        'board': false
    }, {
        'name': 'White Knight 2',
        'model': '/projekt/chessJSView/Knight.model.json',
        'black': false,
        'position': { x: -15, y: 0, z: -21 },
        'rotation': { x: 0, y: 90, z: 0 },
        'board': false
    }, {
        'name': 'White Rook 1',
        'model': '/projekt/chessJSView/Rook.model.json',
        'black': false,
        'position': { x: 21, y: 0, z: -21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'White Rook 2',
        'model': '/projekt/chessJSView/Rook.model.json',
        'black': false,
        'position': { x: -21, y: 0, z: -21 },
        'rotation': { x: 0, y: -90, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 1',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: -21, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 2',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: -15, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 3',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: -9, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 4',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: -3, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 5',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: 3, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 6',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: 9, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 7',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: 15, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'White Pawn 8',
        'model': '/projekt/chessJSView/Pawn.model.json',
        'black': false,
        'position': { x: 21, y: 0, z: -15 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': false
    }, {
        'name': 'Board',
        'model': '/projekt/chessJSView/Board.model.json',
        'black': true,
        'position': { x: 0, y: 0, z: 0 },
        'rotation': { x: 0, y: 0, z: 0 },
        'board': true
    }
];
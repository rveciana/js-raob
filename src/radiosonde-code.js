export function decodeTTAA(ttaaString) {

    console.log(ttaaString);
    if (ttaaString.indexOf('TTAA') == -1)
      throw new Error("String must include TTAA");
    return 42;
};

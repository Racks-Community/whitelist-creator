var Promise = require('bluebird');
require("dotenv").config();

const main = async () => {
  const fs = require("fs");
  const Mode = {
    WLXHOLDER: '1',
    WLXNFT: '2',
  };

  //**Creador de whitelists */
  // Este script crea una whitelist y la almacena en whitelist.txt
  //** CONFIGURACIÓN */
  // Array de contratos de NFTs que queremos agregar en la whitelist, con este script se pueden consultar varios contratos de una vez,
  // junto con su total supply
  // const tokens = ["0xef453154766505feb9dbf0a58e6990fd6eb66969", "0x6172974ACeDb93A0121b2A7B68b8Acea0918BE8c"];
  const tokens = [["0xef453154766505feb9dbf0a58e6990fd6eb66969", 10000], ["0x6172974ACeDb93A0121b2A7B68b8Acea0918BE8c", 2514]];

  // MODOS DE WHITELIST

  // WLXHOLDER: En modo whitelist por ser holder, se crea un array con la lista de los holders de al menos un NFT de los contratos indicados
  
  // WLXHNFT: En modo whitelist por NFT, se crea un mapping "address => integer" en la que se almacena el número de NFTs que tiene cada holder, para así
  // poder dar tantos huecos en la whitelist como NFTs tenga

  const mode = Mode.WLXNFT;

  //** FIN CONFIGURACIÓN */

  // Crear abi, esta parte es común a todas las ERC721 y es la única parte que vamos a necesitar
  const abi = [{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
  
  const start = Date.now();
  owners = []; 
  // Recorremos los contratos que vamos a almacenar
  for(token of tokens){
    contract = new ethers.Contract(token[0], abi, ethers.provider);
    ids = Array.from({length: token[1]}, (_, i) => i + 1);

    owners = owners.concat(await Promise.map(ids, function(i){
      return contract.ownerOf(i);
    }, {concurrency: 1000}));
  }

  // Procesamos el resultado de las llamadas
  if(mode == Mode.WLXHOLDER){
    result = [];
    for(owner of owners){
      if (!result.includes(owner)) {
        result.push(owner);
      }
    }
  }else if(mode == Mode.WLXNFT){
    result = {};
    for(owner of owners){
      if(result[owner] == undefined){
        result[owner] = 1;
      }else{
        result[owner] += 1;
      }
    }
  }

  // Guardamos el archivo
  fs.unlink("carteras.txt", (err) => {
    if (err) throw err;
  });
  fs.writeFileSync("carteras.txt", JSON.stringify(result));

  const end = Date.now();

  console.log("Archivo creado correctamente en %s segundos", (end-start)/1000);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
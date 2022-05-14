# Script para crear whitelist

Este script crea una whitelist a partir de una lista de contratos ERC721.
El script recorrerá cada NFT del contrato y almacenará al owner en un archivo txt.

Probando con el contrato de Mr Crypto, me ha dado tiempos de 30 segundos gracias al procesamiento en paralelo.

MODOS DE WHITELIST

WLXHOLDER: En modo whitelist por ser holder, se crea un array con la lista de los holders de al menos un NFT de los contratos indicados
  
WLXHNFT: En modo whitelist por NFT, se crea un mapping "address => integer" en la que se almacena el número de NFTs que tiene cada holder, para así
poder dar tantos huecos en la whitelist como NFTs tenga
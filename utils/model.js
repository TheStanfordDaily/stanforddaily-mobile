const WPAPI = require("wpapi");
const wp = new WPAPI({ endpoint: "https://stanforddaily.com/wp-json" });

export default wp;

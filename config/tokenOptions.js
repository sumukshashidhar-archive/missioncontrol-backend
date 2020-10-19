module.exports = {
	issuer: "Kappathon Authentication Service",
	signOptions: {
		issuer: "Sigmoid Authentication Service",
		expiresIn: "24h",
		algorithm: "RS512",
	},
	verifyOptions: {
		issuer: "Kappathon Authentication Service",
		expiresIn: "24h",
		algorithm: "RS512",
	},
};

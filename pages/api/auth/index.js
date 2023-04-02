let AM = "POST";

export default function handler(req, res) {

	if(req.method != AM) {
		return res.status(405).json({ message: 'Method not allowed' });
	}

	const { token } = req.body;

	res.status(201).json({ token: token });

}

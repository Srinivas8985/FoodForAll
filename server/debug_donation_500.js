const testDonation = async () => {
    try {
        const uniqueEmail = `donor_${Date.now()}@test.com`;

        // 1. Register a new user
        console.log(`Registering new user: ${uniqueEmail}`);
        const regRes = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Donor',
                email: uniqueEmail,
                password: 'password123',
                role: 'donor',
                phone: '1234567890'
            })
        });

        if (!regRes.ok) {
            console.error('Registration failed:', regRes.status, await regRes.text());
            return;
        }

        const regData = await regRes.json();
        const token = regData.token;
        console.log('Registered & Logged in, got token');

        // 2. Try to create a donation
        const payload = {
            foodName: "Test Curry",
            quantity: "5kg",
            foodType: "cooked",
            preparationTime: "2 hours ago",
            servings: 10,
            isVegetarian: true,
            expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            pickupLocation: "123 Test St",
            contactPhone: "9876543210",
            message: "Fresh food",
            recipientType: "portal",
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            }
        };

        const res = await fetch('http://localhost:5001/api/donations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });

        if (!res.ok) {
            console.error('Donation Error Status:', res.status);
            const text = await res.text();
            console.error('Donation Error Body:', text);
        } else {
            console.log('Success:', await res.json());
        }

    } catch (error) {
        console.error('Script Error:', error);
    }
};

testDonation();

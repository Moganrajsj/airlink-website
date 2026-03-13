const { createLead } = require('./src/app/actions/leads');

// Mock prisma and revalidatePath as we are running in node
// Actually, I can use the real ones if I setup environment, but simpler is to check logic if possible
// Or just run a real script that imports the action.

async function test() {
    console.log("Testing createLead with different inputs...");

    try {
        // Test case 1: Standard mobile
        const r1 = await createLead({
            name: "Test User 1",
            mobile: "9876543210",
            city: "Test City 1"
        });
        console.log("R1 (Standard 10-digit):", r1);

        // Test case 2: Using 'phone' instead of 'mobile'
        const r2 = await createLead({
            name: "Test User 2",
            phone: "9876543211",
            city: "Test City 2"
        });
        console.log("R2 (Using 'phone' key):", r2);

        // Test case 3: Including country code and spaces
        const r3 = await createLead({
            name: "Test User 3",
            mobile: "+91 98765 43212",
            city: "Test City 3"
        });
        console.log("R3 (Formatted with +91):", r3);

        // Test case 4: Failure case (too short)
        const r4 = await createLead({
            name: "Test User 4",
            mobile: "123",
            city: "Test City 4"
        });
        console.log("R4 (Too short - should fail):", r4);

    } catch (e) {
        console.error("Test failed with error:", e);
    }
}

// Since createLead is a "use server" action, it might not run easily in plain node 
// if it depends on Next.js runtime (like revalidatePath).
// I'll create a script that bypasses revalidatePath or mocks it if needed.

// import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';
// import { db } from '@/configs';
// import { JsonForms } from '@/configs/schema';
// import { useUser } from '@clerk/nextjs';
// import { desc, eq } from 'drizzle-orm';
// import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react'
// import Link from 'next/link';
// import { usePathname } from 'next/navigation'
// import React, { useEffect, useState } from 'react'

// function SideNav() {
//     const menuList=[
//         {
//             id:1,
//             name:'My Forms',
//             icon:LibraryBig,
//             path:'/dashboard'
//         },
//         {
//             id:2,
//             name:'Responses',
//             icon:MessageSquare,
//             path:'/dashboard/responses'
//         },
//         {
//             id:3,
//             name:'Analytics',
//             icon:LineChart,
//             path:'/dashboard/analytics'
//         },
//         {
//             id:4,
//             name:'Upgrade',
//             icon:Shield,
//             path:'/dashboard/upgrade'
//         }
//     ]

//     const {user}=useUser();
//     const path=usePathname();
//     const [formList,setFormList]=useState();
//     const [PercFileCreated,setPercFileCreated]=useState(0);

//     useEffect(()=>{
      
//         user&&GetFormList()
//     },[user])

//     const GetFormList = async () => {
//         console.log("DB Instance:", db); // Check if db is undefined
    
//         if (!db) {
//             console.error("Database connection (db) is undefined!");
//             return;
//         }
    
//         const result = await db.select().from(JsonForms)
//             .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
//             .orderBy(desc(JsonForms.id));
    
//         setFormList(result);
    
//         const perc = (result.length / 3) * 100;
//         setPercFileCreated(perc);
//     };
    

//   return (
//     <div className='h-screen shadow-md border'>
//         <div className='p-5'>
//             {menuList.map((menu,index)=>(
//                 <Link href={menu.path}  key={index} 
//                 className={`flex items-center gap-3 p-4 mb-3 
//                 hover:bg-primary hover:text-white rounded-lg
//                 cursor-pointer text-gray-500
//                 ${path==menu.path&&'bg-primary text-white'}
//                 `}>
//                     <menu.icon/>
//                     {menu.name}
//                 </Link>
//             ))}
//         </div>
//         <div className='fixed bottom-7 p-6 w-64 '>
//             <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
//             <div className='my-7'>
//             <Progress value={PercFileCreated} />
//             <h2 className='text-sm mt-2 text-gray-600'><strong>{formList?.length} </strong>Out of <strong>3</strong> File Created</h2>
//             <h2 className='text-sm mt-3 text-gray-600'>Upgrade your plan for unlimted AI form build</h2>
            
//             </div>
//         </div>
//     </div>
//   )
// }

// export default SideNavimport { Button } from '../../../components/ui/button';
import { Button, buttonVariants } from '../../../components/ui/button';  // Adjust path if necessary
import { Progress } from '../../../components/ui/progress';
import { db } from '../../../configs';
import { JsonForms } from '../../../configs/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq } from 'drizzle-orm';
import { LibraryBig, LineChart, MessageSquare, Shield } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, 
    DialogTitle, DialogDescription, Textarea,
} from "../../../components/ui/dialog"; // Import Dialog components
import { Loader2 } from 'lucide-react'; // Import the Loader2 icon for loading spinner

const SideNav=()=> {
    const menuList = [
        { id: 1, name: 'My Forms', icon: LibraryBig, path: '/dashboard' },
        { id: 2, name: 'Responses', icon: MessageSquare, path: '/dashboard/responses' },
        { id: 3, name: 'Analytics', icon: LineChart, path: '/dashboard/analytics' },
        { id: 4, name: 'Upgrade', icon: Shield, path: '/dashboard/upgrade' }
    ];

    const { user } = useUser();
    const path = usePathname();
    const [formList, setFormList] = useState([]); // Initialize formList as an empty array
    const [PercFileCreated, setPercFileCreated] = useState(0);
    const [openDialog, setOpenDialog] = useState(false); // State for opening the dialog
    const [userInput, setUserInput] = useState(''); // State to hold user input for form description
    const [loading, setLoading] = useState(false); // State for loading indicator

    useEffect(() => {
        if (user) {
            GetFormList();
        }
    }, [user]);

    const GetFormList = async () => {
        if (!db) {
            console.error("Database connection (db) is undefined!");
            return;
        }

        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
            .orderBy(desc(JsonForms.id));

        setFormList(result);

        const perc = (result.length / 3) * 100;
        setPercFileCreated(perc);
    };

    const onCreateForm = async () => {
        if (!userInput.trim()) return; // Ensure input is not empty

        setLoading(true);
        // Logic for creating the form (mocked here)
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate loading time
        
        // After form creation, update the form list or refresh it
        await GetFormList();

        setLoading(false);
        setOpenDialog(false); // Close dialog after form creation
    };

    return (
        <div className='h-screen shadow-md border'>
            <div className='p-5'>
                {menuList.map((menu, index) => (
                    <Link href={menu.path} key={index}
                        className={`flex items-center gap-3 p-4 mb-3 
                            hover:bg-primary hover:text-white rounded-lg
                            cursor-pointer text-gray-500
                            ${path == menu.path && 'bg-primary text-white'}`}
                    >
                        <menu.icon />
                        {menu.name}
                    </Link>
                ))}
            </div>

            <div className='fixed bottom-7 p-6 w-64'>
                <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
                <div className='my-7'>
                    <Progress value={PercFileCreated} />
                    <h2 className='text-sm mt-2 text-gray-600'><strong>{formList?.length} </strong>Out of <strong>3</strong> Files Created</h2>
                    <h2 className='text-sm mt-3 text-gray-600'>Upgrade your plan for unlimited AI form builds</h2>
                </div>
            </div>

            {/* Dialog for Creating a New Form */}
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form</DialogTitle>
                        <DialogDescription>
                            <Textarea
                                className="my-2"
                                onChange={(e) => setUserInput(e.target.value)}
                                placeholder="Describe your form (e.g., 'A contact form with name, email, and message fields')"
                                value={userInput}
                            />
                            <div className="flex gap-2 my-3 justify-end">
                                <Button
                                    variant="destructive"
                                    onClick={() => setOpenDialog(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={onCreateForm}
                                    disabled={loading || !userInput.trim()}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin h-4 w-4" />
                                    ) : (
                                        'Create'
                                    )}
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default SideNav;

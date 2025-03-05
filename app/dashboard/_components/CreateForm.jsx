// "use client"
// import React, { useEffect, useState } from 'react'
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog"
// import { Button } from '@/components/ui/button'
// import { Textarea } from '@/components/ui/textarea'
// import { AiChatSession } from '@/configs/AiModal'
// import { useUser } from '@clerk/nextjs'
// import { db } from '@/configs'
// import { JsonForms } from '@/configs/schema'
// import moment from 'moment/moment'
// import { useRouter } from 'next/navigation'
// import { Loader2 } from 'lucide-react'
// import { toast } from 'sonner'
// import { desc, eq } from 'drizzle-orm'

// const PROMPT=",On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle,FieldType, Placeholder, label , required fields, and checkbox and select field type options will be in array only and in JSON format"
// function CreateForm() {
//     const [openDialog,setOpenDailog]=useState(false)
//     const [userInput,setUserInput]=useState();
//     const [loading,setLoading]=useState();
//     const {user}=useUser();
//     const route=useRouter();
 

//     const [formList,setFormList]=useState();
  

//     useEffect(()=>{
      
//         user&&GetFormList()
//     },[user])

//     const GetFormList=async()=>{
//         const result=await db.select().from(JsonForms)
//         .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress))
//         .orderBy(desc(JsonForms.id));

//         setFormList(result);
        
       
//     }
//     const onCreateForm=async()=>{
       
//         if(formList?.length==3)
//         {
//             toast('Upgrade to create unlimted form')
//             return;
//         }
//         setLoading(true)
//       const result= await AiChatSession.sendMessage("Description:"+userInput+PROMPT);
//       console.log(result.response.text());
//       if(result.response.text())
//       {
//         const resp=await db.insert(JsonForms)
//         .values({
//             jsonform:result.response.text(),
//             createdBy:user?.primaryEmailAddress?.emailAddress,
//             createdAt:moment().format('DD/MM/yyyy')
//         }).returning({id:JsonForms.id});

//         console.log("New Form ID",resp[0].id);
//         if(resp[0].id)
//         {
//             route.push('/edit-form/'+resp[0].id)
//         }
//         setLoading(false);
//       }
//       setLoading(false);
//     }
//     return (
//         <div>
//             <Button onClick={()=>setOpenDailog(true)}>+ Create Form</Button>
//             <Dialog open={openDialog}>
               
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Create new form </DialogTitle>
//                         <DialogDescription>
//                         <Textarea className="my-2" 
//                             onChange={(event)=>setUserInput(event.target.value)}
//                         placeholder="Write descrition of your form"/>
//                         <div className='flex gap-2 my-3 justify-end'>
//                             <Button 
//                             onClick={()=>setOpenDailog(false)}
//                             variant="destructive">Cancel</Button>
//                             <Button 
//                                 disabled={loading}
//                             onClick={()=>onCreateForm()}>
//                                 {loading?
//                                 <Loader2 className='animate-spin' />:'Create'    
//                             }
//                                 </Button>

//                         </div>
//                         </DialogDescription>
//                     </DialogHeader>
//                 </DialogContent>
//             </Dialog>

//         </div>
//     )
// }

// export default CreateForm

"use client"
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../../../components/ui/dialog"
import { Button } from '../../../components/ui/button'
import { Textarea } from '../../../components/ui/textarea'
import { AiChatSession } from '../../../configs/AiModal'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../configs'
import { JsonForms } from '../../../configs/schema'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { desc, eq } from 'drizzle-orm'

const PROMPT = ", On Basis of description create JSON form with formTitle, formHeading along with fieldName, FieldTitle, FieldType, Placeholder, label, required fields, and checkbox and select field type options will be in array only and in JSON format"

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false)
    const [userInput, setUserInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [formList, setFormList] = useState([])
    const { user } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (user) GetFormList()
    }, [user])

    const GetFormList = async () => {
        try {
            const result = await db.select()
                .from(JsonForms)
                .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(JsonForms.id))
            setFormList(result)
        } catch (error) {
            console.error('Error fetching forms:', error)
            toast('Failed to load existing forms')
        }
    }

    const onCreateForm = async () => {
        try {
            if (formList?.length >= 3) {
                toast('Upgrade to create unlimited forms')
                return
            }
            
            if (!userInput.trim()) {
                toast('Please enter a form description')
                return
            }

            setLoading(true)
            
            const result = await AiChatSession.sendMessage(
                `Description: ${userInput} ${PROMPT}`
            )

            if (!result?.response?.text?.()) {
                throw new Error('Empty response from AI')
            }

            const resp = await db.insert(JsonForms)
                .values({
                    jsonform: result.response.text(),
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format('DD/MM/yyyy')
                })
                .returning({ id: JsonForms.id })

            if (resp[0]?.id) {
                router.push(`/edit-form/${resp[0].id}`)
                setOpenDialog(false)
                toast('Form created successfully!')
            }
        } catch (error) {
            console.error('Form creation error:', error)
            toast(error.message || 'Failed to create form. Check API configuration.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            
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
    )
}

export default CreateForm
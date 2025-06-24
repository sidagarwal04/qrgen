'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, FileText, Wifi, Contact, FileUp } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { QrCodeDisplay } from './qr-code-display';
import { QrCustomization } from './qr-customization';

const urlSchema = z.object({
  url: z.string().url({ message: 'Please enter a valid URL.' }),
});

const textSchema = z.object({
  text: z.string().min(1, { message: 'Text cannot be empty.' }),
});

const wifiSchema = z.object({
  ssid: z.string().min(1, { message: 'Network SSID is required.' }),
  password: z.string(),
  encryption: z.enum(['WPA', 'WEP', 'nopass']),
});

const vCardSchema = z.object({
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string(),
  phone: z.string(),
  email: z.string().email('Invalid email address.').optional().or(z.literal('')),
  website: z.string().url('Invalid URL.').optional().or(z.literal('')),
  organization: z.string(),
});

const fileSchema = z.object({
  file: (typeof window === 'undefined' ? z.any() : z.instanceof(FileList))
    .refine((files) => files?.length > 0, 'File is required.'),
});

type QrType = 'url' | 'text' | 'wifi' | 'vcard' | 'file';

export function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [qrValue, setQrValue] = useState('https://qrfy.com/');
  const [customization, setCustomization] = useState({
    primaryColor: '#1F9481',
    backgroundColor: '#ffffff',
  });

  const handleCustomizationChange = (newCustomization: Partial<typeof customization>) => {
    setCustomization(prev => ({ ...prev, ...newCustomization }));
  };

  const UrlForm = () => {
    const form = useForm<z.infer<typeof urlSchema>>({
      resolver: zodResolver(urlSchema),
      defaultValues: { url: 'https://qrfy.com/' },
      mode: 'onBlur'
    });
    
    function onSubmit(data: z.infer<typeof urlSchema>) {
      if (data.url) {
        setQrValue(data.url);
      }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Generate QR Code</Button>
        </form>
      </Form>
    );
  };

  const TextForm = () => {
    const form = useForm<z.infer<typeof textSchema>>({
      resolver: zodResolver(textSchema),
      defaultValues: { text: '' },
    });

    function onSubmit(data: z.infer<typeof textSchema>) {
        if(data.text) {
            setQrValue(data.text);
        }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Text</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter any text here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Generate QR Code</Button>
        </form>
      </Form>
    );
  };
  
  const WifiForm = () => {
    const form = useForm<z.infer<typeof wifiSchema>>({
      resolver: zodResolver(wifiSchema),
      defaultValues: { ssid: '', password: '', encryption: 'WPA' },
    });

    function onSubmit(values: z.infer<typeof wifiSchema>) {
        const { ssid, password, encryption } = values;
        if (ssid) {
            setQrValue(`WIFI:S:${ssid};T:${encryption};P:${password};;`);
        }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ssid"
            render={({ field }) => (
              <FormItem className="sm:col-span-2">
                <FormLabel>Network Name (SSID)</FormLabel>
                <FormControl>
                  <Input placeholder="MyWiFiNetwork" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="encryption"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Encryption</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select encryption" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="sm:col-span-2 pt-2">
            <Button type="submit" className="w-full">Generate QR Code</Button>
          </div>
        </form>
      </Form>
    );
  };

  const VCardForm = () => {
    const form = useForm<z.infer<typeof vCardSchema>>({
      resolver: zodResolver(vCardSchema),
      defaultValues: { firstName: '', lastName: '', phone: '', email: '', website: '', organization: '' },
    });

    function onSubmit(values: z.infer<typeof vCardSchema>) {
        const { firstName, lastName, phone, email, website, organization } = values;
        if (firstName) {
            const vCard = `BEGIN:VCARD
VERSION:4.0
N:${lastName};${firstName};;;
FN:${firstName} ${lastName}
ORG:${organization}
TEL;TYPE=work,voice:${phone}
EMAIL:${email}
URL:${website}
END:VCARD`;
            setQrValue(vCard);
        }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid sm:grid-cols-2 gap-4">
          <FormField control={form.control} name="firstName" render={({ field }) => (<FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="lastName" render={({ field }) => (<FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="organization" render={({ field }) => (<FormItem><FormLabel>Organization</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="website" render={({ field }) => (<FormItem><FormLabel>Website</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <div className="sm:col-span-2 pt-2">
             <Button type="submit" className="w-full">Generate QR Code</Button>
          </div>
        </form>
      </Form>
    );
  }

  const FileForm = () => {
    const form = useForm<z.infer<typeof fileSchema>>({
      resolver: zodResolver(fileSchema),
    });

    function onSubmit(data: z.infer<typeof fileSchema>) {
        const file = data.file?.[0];
        if (file) {
            setQrValue(`Your file "${file.name}" would be available for download here. This requires a backend for file storage.`);
        }
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange, value, ...rest } }) => (
              <FormItem>
                <FormLabel>PDF or Image File</FormLabel>
                <FormControl>
                  <Input type="file" accept="image/*,.pdf" onChange={(e) => onChange(e.target.files)} {...rest} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Note: File upload requires a backend service. This demo will generate a QR code with placeholder text.
          </p>
          <Button type="submit" className="w-full">Generate QR Code</Button>
        </form>
      </Form>
    );
  }

  const formComponents = {
    url: <UrlForm />,
    text: <TextForm />,
    wifi: <WifiForm />,
    vcard: <VCardForm />,
    file: <FileForm />,
  };

  const qrTypesConfig = [
    { value: 'url', label: 'URL', icon: Link },
    { value: 'text', label: 'Text', icon: FileText },
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'vcard', label: 'vCard', icon: Contact },
    { value: 'file', label: 'File', icon: FileUp },
  ];

  return (
    <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Tabs value={qrType} onValueChange={(value) => setQrType(value as QrType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-5 mb-4 h-auto">
                        {qrTypesConfig.map(config => (
                            <TabsTrigger key={config.value} value={config.value} className="flex flex-col sm:flex-row gap-2 h-auto py-2">
                                <config.icon className="h-5 w-5" />
                                {config.label}
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {qrTypesConfig.map(config => (
                        <TabsContent key={config.value} value={config.value}>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Enter {config.label} Details</CardTitle>
                                    <CardDescription>Fill in the information to generate your QR code.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {formComponents[config.value as QrType]}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
            <div className="lg:col-span-1 space-y-8">
                <QrCodeDisplay value={qrValue} {...customization} />
                <QrCustomization onChange={handleCustomizationChange} currentColors={{primary: customization.primaryColor, background: customization.backgroundColor}} />
            </div>
        </div>
    </div>
  );
}

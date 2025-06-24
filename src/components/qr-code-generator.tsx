'use client';

import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, FileText, Wifi, Contact, Mail, MessageSquare } from 'lucide-react';

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

const whatsappSchema = z.object({
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  message: z.string().optional(),
});

const emailSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  subject: z.string().optional(),
  body: z.string().optional(),
});

const smsSchema = z.object({
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  message: z.string().optional(),
});

type QrType = 'url' | 'text' | 'wifi' | 'vcard' | 'whatsapp' | 'email' | 'sms';

export function QrCodeGenerator() {
  const [qrType, setQrType] = useState<QrType>('url');
  const [qrValue, setQrValue] = useState('https://qrgen.com/');
  const [customization, setCustomization] = useState({
    primaryColor: '#000000',
    backgroundColor: '#ffffff',
  });

  const handleCustomizationChange = (newCustomization: Partial<typeof customization>) => {
    setCustomization(prev => ({ ...prev, ...newCustomization }));
  };

  const UrlForm = () => {
    const form = useForm<z.infer<typeof urlSchema>>({
      resolver: zodResolver(urlSchema),
      defaultValues: { url: 'https://qrgen.com/' },
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

  const WhatsAppForm = () => {
    const form = useForm<z.infer<typeof whatsappSchema>>({
      resolver: zodResolver(whatsappSchema),
      defaultValues: { phone: '', message: '' },
    });

    function onSubmit(data: z.infer<typeof whatsappSchema>) {
      const { phone, message } = data;
      const cleanPhone = phone.replace(/[^0-9]/g, '');
      const whatsappUrl = `https://wa.me/${cleanPhone}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
      setQrValue(whatsappUrl);
    }
    
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="e.g., 1234567890 (with country code)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Pre-filled message for WhatsApp" {...field} />
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
  
  const EmailForm = () => {
    const form = useForm<z.infer<typeof emailSchema>>({
      resolver: zodResolver(emailSchema),
      defaultValues: { email: '', subject: '', body: '' },
    });

    function onSubmit(data: z.infer<typeof emailSchema>) {
      const { email, subject, body } = data;
      const params = new URLSearchParams();
      if (subject) params.append('subject', subject);
      if (body) params.append('body', body);
      const queryString = params.toString();
      setQrValue(`mailto:${email}${queryString ? `?${queryString}` : ''}`);
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="recipient@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Email subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body (Optional)</FormLabel>
                <FormControl>
                  <Textarea placeholder="Email body" {...field} />
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
  
  const SmsForm = () => {
    const form = useForm<z.infer<typeof smsSchema>>({
      resolver: zodResolver(smsSchema),
      defaultValues: { phone: '', message: '' },
    });
    
    function onSubmit(data: z.infer<typeof smsSchema>) {
        const { phone, message } = data;
        setQrValue(`smsto:${phone.replace(/[^0-9]/g, '')}:${message || ''}`);
    }

    return (
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                    <Input type="tel" placeholder="e.g., 1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Message (Optional)</FormLabel>
                    <FormControl>
                    <Textarea placeholder="Pre-filled SMS message" {...field} />
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

  const formComponents = {
    url: <UrlForm />,
    text: <TextForm />,
    wifi: <WifiForm />,
    vcard: <VCardForm />,
    whatsapp: <WhatsAppForm />,
    email: <EmailForm />,
    sms: <SmsForm />,
  };

  const qrTypesConfig = [
    { value: 'url', label: 'URL', icon: Link },
    { value: 'text', label: 'Text', icon: FileText },
    { value: 'wifi', label: 'WiFi', icon: Wifi },
    { value: 'vcard', label: 'vCard', icon: Contact },
    { value: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
    { value: 'email', label: 'Email', icon: Mail },
    { value: 'sms', label: 'SMS', icon: MessageSquare },
  ];

  return (
    <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <Tabs value={qrType} onValueChange={(value) => setQrType(value as QrType)} className="w-full">
                    <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 md:grid-cols-7 mb-4 h-auto">
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

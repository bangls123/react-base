import {
  Badge,
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Empty,
  Input,
  Modal,
  RadioGroup,
  Select,
  Spinner,
  Upload,
} from '@/shared/components';
import React, { useState } from 'react';

export const UIDemoPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [radioValue, setRadioValue] = useState<string | number>('option1');

  return (
    <div className="container mx-auto space-y-12 py-10">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">UI Components Demo</h1>
        <p className="mt-4 text-xl text-gray-500">
          A showcase of the shared UI components built with Tailwind CSS.
        </p>
      </header>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button isLoading>Loading</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Inputs</h2>
        <div className="grid max-w-sm gap-4">
          <Input placeholder="Standard Input" />
          <Input placeholder="Input with Error" error="This field is required" />
          <Input type="password" placeholder="Password Input" />
          <Input disabled placeholder="Disabled Input" />
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Cards</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
            </CardHeader>
            <CardContent>
              <p>This is the content of the card. It can contain any elements.</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Interactive Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Click the button below to open a modal.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </section>

      {/* Select & Radio */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Select & Radio Group</h2>
        <div className="grid max-w-sm gap-6">
          <Select
            label="Choose an option"
            options={[
              { label: 'Option 1', value: '1' },
              { label: 'Option 2', value: '2' },
              { label: 'Option 3', value: '3' },
            ]}
          />
          <RadioGroup
            label="Select your preference"
            name="demo-radio"
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { label: 'Choice A', value: 'option1' },
              { label: 'Choice B', value: 'option2' },
              { label: 'Choice C (Disabled)', value: 'option3', disabled: true },
            ]}
          />
        </div>
      </section>

      {/* Upload */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Upload</h2>
        <div className="max-w-md">
          <Upload onFileSelect={(files) => console.log(files)} />
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Loading States</h2>
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
          <Spinner size="xl" />
        </div>
      </section>

      {/* Empty States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Empty States</h2>
        <Card className="border-dashed">
          <Empty
            title="No projects found"
            description="You haven't created any projects yet. Get started by creating a new one."
            action={<Button>Create Project</Button>}
          />
        </Card>
      </section>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Sample Modal">
        <div className="space-y-4">
          <p>This is a modal component rendered via React Portals.</p>
          <p>It supports closing on backdrop click, escape key, or the close button.</p>
          <div className="flex justify-end">
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

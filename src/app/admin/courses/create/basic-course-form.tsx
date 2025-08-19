"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BarChart3,
  BookOpen,
  Clock,
  DollarSign,
  FileText,
  Image,
  Layers,
  Tag,
  Type,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CourseCreationSchema } from "@/lib/zod-schema";
import {
  courseCategoryEnum,
  courseLevelEnum,
  statusEnum,
} from "@/server/db/schema";

const BasicCourseForm = () => {
  const form = useForm<z.infer<typeof CourseCreationSchema>>({
    resolver: zodResolver(CourseCreationSchema),
    defaultValues: {
      title: "",
      description: "<p>Hello World! 🌎️</p>",
      duration: undefined,
      price: undefined,
      status: "draft",
      level: undefined,
      smallDescription: "",
      fileKey: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CourseCreationSchema>) => {
    console.log(values);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Type className="w-4 h-4" />
                  Course Title
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter course title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Small Description Field */}
          <FormField
            control={form.control}
            name="smallDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4" />
                  Short Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Brief description of your course"
                    className="resize-none h-20"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  Course Description
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {/* <Textarea
                    placeholder="Detailed description of your course content, objectives, and what students will learn"
                    className="resize-none h-32"
                    {...field}
                  /> */}
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Two column layout for smaller fields */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Category Field */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem className="lg:flex-1">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Tag className="w-4 h-4" />
                    Category
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full capitalize">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseCategoryEnum.enumValues.map((category) => (
                        <SelectItem
                          key={category}
                          value={category.toLowerCase().replace(/\s+/g, "-")}
                          className="capitalize"
                        >
                          {category.replaceAll("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Level Field */}
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem className="lg:flex-1">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <BarChart3 className="w-4 h-4" />
                    Difficulty Level
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full ">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {courseLevelEnum.enumValues.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() + level.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Three column layout for numeric fields */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Duration Field */}
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="120"
                      min="1"
                      max="1440"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price Field */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="w-4 h-4" />
                    Price ($)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="99.99"
                      min="0"
                      step="0.01"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Status Field */}
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <Layers className="w-4 h-4" />
                    Status
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statusEnum.enumValues.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* File Key Field */}
          <FormField
            control={form.control}
            name="fileKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Image className="w-4 h-4" />
                  Course Thumbnail
                </FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      field.onChange(e.target.files?.[0]?.name || "")
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="px-8">
              Create Course
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BasicCourseForm;

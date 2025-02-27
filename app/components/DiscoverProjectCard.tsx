'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card } from './ui/card'
import type { Project } from '../types'

interface DiscoverProjectCardProps {
  project: Project
}

export function DiscoverProjectCard({ project }: DiscoverProjectCardProps) {
  return (
    <Link href={`/projects/${project._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 bg-white dark:bg-zinc-900">
        <div className="p-6">
          <div className="flex items-center gap-4">
            {project.logo ? (
              <Image
                src={project.logo}
                alt={project.name}
                width={50}
                height={50}
                className="rounded-lg"
              />
            ) : (
              <div className="w-[50px] h-[50px] bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold text-gray-500">{project.name[0]}</span>
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{project.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{project.description}</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {project.builderImage ? (
              <Image
                src={project.builderImage}
                alt={project.builderName}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-200 dark:bg-gray-800 rounded-full" />
            )}
            <span className="text-sm text-gray-600 dark:text-gray-300">{project.builderName}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
} 
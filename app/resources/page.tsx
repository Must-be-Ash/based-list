'use client';

import { useState } from 'react';
import Image from 'next/image';
import ResourceCard from '../components/ResourceCard';
import ResourceSection from '../components/ResourceSection';
import Modal from '../components/Modal';
import ResourceSubmissionForm from '../components/ResourceSubmissionForm';
import ResourceFilter from '../components/ResourceFilter';
import { Plus } from 'lucide-react';

export default function ResourcesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Getting Started',
    'Deployment Guides',
    'Tools & Infrastructure',
    'Grants',
    'Community',
    'AI Agents'
  ];

  const handleSubmitResource = async (data: { title: string; description: string; link: string }) => {
    const response = await fetch('/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to submit resource');
    }
  };

  const filterResources = (sectionTitle: string) => {
    if (selectedCategory !== 'all' && selectedCategory !== sectionTitle) {
      return false;
    }
    if (!searchQuery) {
      return true;
    }
    const sectionContent = getSectionContent(sectionTitle);
    return sectionContent.some(
      card => 
        card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getSectionContent = (section: string) => {
    switch (section) {
      case 'Getting Started':
        return [
          {
            title: "Base Brand Kit",
            description: "Official brand guide and logos for Base. Access Base's design assets, style guides, and brand resources for building consistent Base experiences.",
            link: "https://github.com/base-org/brand-kit"
          },
          // ... other Getting Started resources
        ];
      case 'Deployment Guides':
        return [
          {
            title: "Deploy with Hardhat",
            description: "Walkthrough for deploying a contract on Base using Hardhat.",
            link: "https://docs.base.org/tutorials/deploy-with-hardhat/"
          },
          // ... other Deployment resources
        ];
      // ... cases for other sections
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <div className="bg-white/80 dark:bg-black/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 pt-32 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/Base_Network_Logo.svg"
                alt="Base Network"
                width={48}
                height={48}
                className="dark:invert"
              />
              <h1 className="text-5xl font-bold text-[#0052FF]">Resources</h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about building on Base - from documentation to deployment guides.
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <ResourceFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-[#0052FF] dark:bg-black/50 backdrop-blur-sm text-white rounded-xl 
                     hover:bg-[#0052FF]/90 hover:text-white transition-all duration-300 border border-[#0052FF]/20
                     shadow-md hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Submit Resource
          </button>
        </div>

        <div className="space-y-16">
          {filterResources('Getting Started') && (
            <ResourceSection title="Getting Started">
              <ResourceCard
                title="Base Testnet"
                description="Introduction to the Base Testnet environment, how to configure your wallet for it, and how to get started testing."
                link="https://docs.base.org/base-learn/docs/deployment-to-testnet/test-networks/"
              />
              <ResourceCard
                title="Base Learn"
                description="Learn to build smart contracts and onchain apps with Base's comprehensive learning platform. Includes tutorials, exercises, and NFT rewards for completion."
                link="https://docs.base.org/base-learn/docs/welcome/"
              />
              <ResourceCard
                title="Base Tutorials"
                description="Step-by-step guides that walk you through real-world examples of building on Base. Perfect for hands-on learning."
                link="https://docs.base.org/tutorials"
              />
            </ResourceSection>
          )}

          {filterResources('Deployment Guides') && (
            <ResourceSection title="Deployment Guides">
              <ResourceCard
                title="Deploy with Hardhat"
                description="Walkthrough for deploying a contract on Base using Hardhat."
                link="https://docs.base.org/tutorials/deploy-with-hardhat/"
              />
              <ResourceCard
                title="Deploy with Foundry"
                description="Guide to deploying on Base with Foundry."
                link="https://docs.base.org/tutorials/deploy-with-foundry/"
              />
              <ResourceCard
                title="Deploy with Remix"
                description="Instructions on using the Remix IDE for Base contract deployment."
                link="https://docs.base.org/tutorials/deploy-with-remix/"
              />
              <ResourceCard
                title="Deploy with Truffle"
                description="How to use Truffle to compile and deploy on Base."
                link="https://archive.trufflesuite.com/docs/"
              />
            </ResourceSection>
          )}

          {filterResources('Tools & Infrastructure') && (
            <ResourceSection title="Tools & Infrastructure">
              <ResourceCard
                title="Block Explorer"
                description="Explains how to use block explorers on Base, verify contracts, and examine transactions."
                link="https://basescan.org/"
              />
              <ResourceCard
                title="Faucets"
                description="Guidance on obtaining Goerli ETH to then bridge over to Base Testnet."
                link="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
              />
              <ResourceCard
                title="Wallets"
                description="Create a Smart Wallet to interact with Base."
                link="https://www.smartwallet.dev/quick-start"
              />
              <ResourceCard
                title="Base Brand Kit"
                description="Official brand guide and logos for Base. Access Base's design assets, style guides, and brand resources for building consistent Base experiences."
                link="https://github.com/base-org/brand-kit"
              />
            </ResourceSection>
          )}

          {filterResources('Grants') && (
            <ResourceSection title="Grants">
              <ResourceCard
                title="Base Grants Program"
                description="Learn about Base's grant program, funding opportunities, and how to apply for support in building on Base."
                link="https://paragraph.xyz/@grants.base.eth/calling-based-builders"
              />
              <ResourceCard
                title="Base Bounties"
                description="Explore and participate in Base's bounty program on Rounds. Find opportunities to contribute and earn rewards."
                link="https://rounds.wtf/"
              />
              <ResourceCard
                title="Bug Bounty Program"
                description="Help secure the Base ecosystem by finding and reporting security vulnerabilities through Coinbase's bug bounty program."
                link="https://hackerone.com/coinbase?type=team"
              />
            </ResourceSection>
          )}

          {filterResources('Community') && (
            <ResourceSection title="Community">
              <ResourceCard
                title="Base Builds (Farcaster)"
                description="Join the Base Builds channel on Farcaster to connect with other builders and stay updated on the latest developments."
                link="https://warpcast.com/~/channel/base-builds"
              />
              <ResourceCard
                title="Base Discord"
                description="Join the main community chat and support server."
                link="https://discord.gg/buildonbase"
              />
              <ResourceCard
                title="Base GitHub"
                description="Official GitHub organization for Base, containing code repos and developer resources."
                link="https://github.com/base-org"
              />
              <ResourceCard
                title="Base Twitter"
                description="Follow the official Twitter handle for announcements."
                link="https://twitter.com/base"
              />
            </ResourceSection>
          )}

          {filterResources('AI Agents') && (
            <ResourceSection title="AI Agents">
              <ResourceCard
                title="AgentKit - Installation & Setup"
                description="Detailed instructions on installing AgentKit (via package managers, GitHub, etc.) and configuring any required environment variables, permissions, or credentials."
                link="https://docs.cdp.coinbase.com/agentkit/docs/installation-and-setup"
              />
              <ResourceCard
                title="AgentKit - API Reference"
                description="Comprehensive list of AgentKit classes, methods, functions, and interfaces. This is typically where you'll look up parameters, return types, and usage details."
                link="https://docs.cdp.coinbase.com/agentkit/docs/api-reference"
              />
              <ResourceCard
                title="AgentKit - Tutorials"
                description="Step-by-step guides showing how to build projects or features using AgentKit. Often includes sample repositories or code snippets you can clone and run."
                link="https://docs.cdp.coinbase.com/agentkit/docs/tutorials"
              />
              <ResourceCard
                title="AgentKit - Community & Support"
                description="Points to discussion forums, GitHub issues, Discord/Slack channels (if any), and ways to contact the AgentKit or Coinbase Developer Platform team for help."
                link="https://docs.cdp.coinbase.com/agentkit/docs/community-support"
              />

              <ResourceCard
                title="Eliza Framework"
                description="Open-source framework for building onchain AI Agents. Available on GitHub for developers to explore and contribute."
                link="https://github.com/elizaOS/eliza"
              />
              <ResourceCard
                title="Mee.fun"
                description="No-code tool to create and deploy onchain AI Agents. Perfect for those looking to build AI agents without coding experience."
                link="https://mee.fun/"
              />
              <ResourceCard
                title="Eliza Character Generator"
                description="Character maker tool specifically designed for the Eliza Framework, helping you create unique AI agent personalities."
                link="https://elizagen.howieduhzit.best/"
              />
            </ResourceSection>
          )}
        </div>
      </main>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Submit a Resource"
      >
        <ResourceSubmissionForm
          onSubmit={handleSubmitResource}
          onClose={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

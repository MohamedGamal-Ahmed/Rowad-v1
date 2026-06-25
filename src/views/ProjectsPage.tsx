import React, { useState, useEffect } from 'react';
import { ProjectList } from '../features/projects/components/ProjectList';
import { AddProject } from '../features/projects/components/AddProject';
import { MasterRegisters } from '../features/projects/components/MasterRegisters';
import { ProjectWorkspace } from '../features/projects/components/ProjectWorkspace';
import { ProjectRepository } from '../repositories/ProjectRepository';
import { Project } from '../domain/projects/Project';

interface ProjectsPageProps {
  lang: 'ar' | 'en';
  settings?: any;
}

export function ProjectsPage({
  lang,
  settings
}: ProjectsPageProps) {
  const projectRepo = new ProjectRepository();
  const isAr = lang === 'ar';

  // Navigation states: 'list' | 'add' | 'masters' | 'workspace'
  const [viewState, setViewState] = useState<'list' | 'add' | 'masters' | 'workspace'>('list');
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');

  const loadProjects = async () => {
    const list = await projectRepo.getAll();
    setProjects(list);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSaveNewProject = async (newProj: Project) => {
    await projectRepo.save(newProj);
    await projectRepo.addHistory(newProj.id, 'Project Registered', 'System', `Registered project code: ${newProj.code}`);
    await loadProjects();
    setViewState('list');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      
      {/* Dynamic Header Titles based on routing state */}
      {viewState === 'list' && (
        <div className="space-y-1.5 mb-8">
          <h1 className="text-3xl font-black text-brand-navy dark:text-slate-100 tracking-tight">
            {isAr ? 'محفظة وإدارة المشاريع' : 'Projects Portfolio Workspace'}
          </h1>
          <p className="text-slate-400 text-xs">
            {isAr 
              ? 'مستودع السجلات والمستخلصات والأوامر التغييرية والمطالبات المرتبطة بجميع المشروعات النشطة وقبل الترسية.'
              : 'Central hub for project master records, contract payments, claims, and regulatory permits.'
            }
          </p>
        </div>
      )}

      {/* Screen router */}
      {viewState === 'list' && (
        <ProjectList
          projects={projects}
          lang={lang}
          onSelectProject={(id) => {
            setSelectedProjectId(id);
            setViewState('workspace');
          }}
          onAddNew={() => setViewState('add')}
          onViewMasters={() => setViewState('masters')}
        />
      )}

      {viewState === 'add' && (
        <AddProject
          lang={lang}
          onSave={handleSaveNewProject}
          onCancel={() => setViewState('list')}
        />
      )}

      {viewState === 'masters' && (
        <MasterRegisters
          lang={lang}
          onBack={() => setViewState('list')}
        />
      )}

      {viewState === 'workspace' && selectedProjectId && (
        <ProjectWorkspace
          projectId={selectedProjectId}
          lang={lang}
          onBack={() => {
            setSelectedProjectId('');
            setViewState('list');
            loadProjects();
          }}
        />
      )}

    </div>
  );
}

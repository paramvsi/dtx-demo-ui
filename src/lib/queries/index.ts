/**
 * React Query hooks wrapping every mock module.
 * Each hook adds 200–600ms artificial latency so loading states actually render.
 *
 * Swapping to real APIs later is a per-hook change — components don't need to
 * know whether the data came from `lib/mock/*` or a fetch.
 */
import { useQuery } from '@tanstack/react-query';
import { PIPELINES, getPipeline } from '@/lib/mock/pipelines';
import { USERS, getUser } from '@/lib/mock/users';
import { EVENTS } from '@/lib/mock/events';
import { SCHEMAS, getSchema } from '@/lib/mock/schemas';
import { KAFKA_TOPICS, getKafkaTopic } from '@/lib/mock/kafka';
import { CACHE_KEYS, getCacheKey } from '@/lib/mock/cache';
import { SYNTHETIC_JOBS, getSyntheticJob } from '@/lib/mock/synthetic';
import { GROUPS, getGroup } from '@/lib/mock/groups';
import { ROLES, getRole } from '@/lib/mock/roles';
import type { UserRole } from '@/lib/types';

function delay<T>(value: T, min = 200, max = 600): Promise<T> {
  const ms = min + Math.random() * (max - min);
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

// ---- Pipelines ----
export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => delay(PIPELINES),
  });
}

export function usePipeline(id: string | undefined) {
  return useQuery({
    queryKey: ['pipeline', id],
    queryFn: () => delay(id ? getPipeline(id) : undefined),
    enabled: !!id,
  });
}

// ---- Users ----
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => delay(USERS),
  });
}

export function useUser(id: string | undefined) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => delay(id ? getUser(id) : undefined),
    enabled: !!id,
  });
}

// ---- Events ----
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => delay(EVENTS),
  });
}

// ---- Schemas ----
export function useSchemas() {
  return useQuery({
    queryKey: ['schemas'],
    queryFn: () => delay(SCHEMAS),
  });
}

export function useSchema(id: string | undefined) {
  return useQuery({
    queryKey: ['schema', id],
    queryFn: () => delay(id ? getSchema(id) : undefined),
    enabled: !!id,
  });
}

// ---- Kafka ----
export function useKafkaTopics() {
  return useQuery({
    queryKey: ['kafka-topics'],
    queryFn: () => delay(KAFKA_TOPICS),
  });
}

export function useKafkaTopic(id: string | undefined) {
  return useQuery({
    queryKey: ['kafka-topic', id],
    queryFn: () => delay(id ? getKafkaTopic(id) : undefined),
    enabled: !!id,
  });
}

// ---- Cache ----
export function useCacheKeys() {
  return useQuery({
    queryKey: ['cache-keys'],
    queryFn: () => delay(CACHE_KEYS),
  });
}

export function useCacheKey(id: string | undefined) {
  return useQuery({
    queryKey: ['cache-key', id],
    queryFn: () => delay(id ? getCacheKey(id) : undefined),
    enabled: !!id,
  });
}

// ---- Synthetic ----
export function useSyntheticJobs() {
  return useQuery({
    queryKey: ['synthetic-jobs'],
    queryFn: () => delay(SYNTHETIC_JOBS),
  });
}

export function useSyntheticJob(id: string | undefined) {
  return useQuery({
    queryKey: ['synthetic-job', id],
    queryFn: () => delay(id ? getSyntheticJob(id) : undefined),
    enabled: !!id,
  });
}

// ---- Groups ----
export function useGroups() {
  return useQuery({
    queryKey: ['groups'],
    queryFn: () => delay(GROUPS),
  });
}

export function useGroup(id: string | undefined) {
  return useQuery({
    queryKey: ['group', id],
    queryFn: () => delay(id ? getGroup(id) : undefined),
    enabled: !!id,
  });
}

// ---- Roles ----
export function useRoles() {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => delay(ROLES),
  });
}

export function useRole(id: UserRole | undefined) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => delay(id ? getRole(id) : undefined),
    enabled: !!id,
  });
}

import { useState } from 'react'
import { View, Image, TouchableOpacity, Text, FlatList } from 'react-native'

import { styles } from './styles'
import { FilterStatus } from '@/types/FilterStatus'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Filter } from '@/components/Filter'
import { Item } from '@/components/Item'

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]
const ITEMS = [
  { id: '1', status: FilterStatus.DONE, description: 'Café' },
  { id: '2', status: FilterStatus.PENDING, description: 'Macarrão' },
  { id: '3', status: FilterStatus.PENDING, description: 'Nutella' },
  { id: '4', status: FilterStatus.PENDING, description: 'Carne' },
]

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FILTER_STATUS[0])

  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo}/>

      <View style={styles.form}>
        <Input placeholder="O que você precisa comprar?" />
        <Button title='Adicionar'/>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          {
            FILTER_STATUS.map((status) => (
              <Filter 
                key={status} 
                status={status} 
                isActive={filter === status}
                onPress={() => setFilter(status)}
              />
            ))
          }

          <TouchableOpacity style={styles.clearButton}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList 
          data={ITEMS}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Item
                data={item}
                onRemove={() => console.log('Remove item')}
                onStatus={() => console.log('Change item status')}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum item aqui</Text>
          )}
        />
      </View>
    </View>
  )
}
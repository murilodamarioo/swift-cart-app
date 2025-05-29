import { useState, useEffect } from 'react'
import { 
  View, 
  Image, 
  TouchableOpacity, 
  Text, 
  FlatList, 
  Alert 
} from 'react-native'

import { styles } from './styles'
import { FilterStatus } from '@/types/FilterStatus'
import { itemsStorage, ItemStorage } from '@/storage/itemStorage'

import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Filter } from '@/components/Filter'
import { Item } from '@/components/Item'

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE]

export function Home() {
  const [filter, setFilter] = useState<FilterStatus>(FILTER_STATUS[0])
  const [description, setDescription] = useState<string>('')
  const [items, setItems] = useState<ItemStorage[]>([])

  async function handleAddItem() {
    if (!description.trim()) {
      return Alert.alert('Adicionar', 'Informe a descrição para adicionar')
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: FilterStatus.PENDING,
    }

    await itemsStorage.add(newItem)
    await itemsByStatus()
  }

  async function itemsByStatus() {
    try {
      const response = await itemsStorage.getByStatus(filter)
      setItems(response)
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível filtrar os itens')
    }
  }

  useEffect(() => {
    itemsByStatus()
  }, [filter])
  
  return (
    <View style={styles.container}>
      <Image source={require('@/assets/logo.png')} style={styles.logo}/>

      <View style={styles.form}>
        <Input 
          onChangeText={setDescription}
          placeholder="O que você precisa comprar?"
        />
        <Button title='Adicionar' onPress={handleAddItem}/>
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
          data={items}
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